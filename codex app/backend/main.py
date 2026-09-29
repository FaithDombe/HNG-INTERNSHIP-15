from contextlib import asynccontextmanager
import os
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


DEFAULT_DB = Path(__file__).with_name("todos.db")
DB_PATH = Path(os.environ.get("TODO_DB_PATH", str(DEFAULT_DB)))
FRONTEND_DIST = Path(__file__).resolve().parents[1] / "frontend" / "dist"


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


@asynccontextmanager
async def lifespan(app: FastAPI):
    with connect() as db:
        db.execute("""CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            notes TEXT NOT NULL DEFAULT '',
            completed INTEGER NOT NULL DEFAULT 0,
            position INTEGER NOT NULL
        )""")
        columns = {row["name"] for row in db.execute("PRAGMA table_info(todos)")}
        if "notes" not in columns:
            db.execute("ALTER TABLE todos ADD COLUMN notes TEXT NOT NULL DEFAULT ''")
    yield


app = FastAPI(title="Simple Todo API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    notes: str = Field(default="", max_length=5000)


class TodoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=5000)
    completed: bool | None = None


def serialize(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "notes": row["notes"],
        "completed": bool(row["completed"]),
        "position": row["position"],
    }


@app.get("/api/todos")
def list_todos():
    with connect() as db:
        rows = db.execute("SELECT * FROM todos ORDER BY position, id")
        return [serialize(row) for row in rows]


@app.post("/api/todos", status_code=201)
def create_todo(todo: TodoCreate):
    title = todo.title.strip()
    if not title:
        raise HTTPException(422, "Task name cannot be empty")
    with connect() as db:
        position = db.execute("SELECT COALESCE(MAX(position), -1) + 1 FROM todos").fetchone()[0]
        cursor = db.execute(
            "INSERT INTO todos (title, notes, position) VALUES (?, ?, ?)",
            (title, todo.notes.strip(), position),
        )
        row = db.execute("SELECT * FROM todos WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return serialize(row)


@app.patch("/api/todos/{todo_id}")
def update_todo(todo_id: int, update: TodoUpdate):
    changes = update.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(422, "Provide a task name, notes, or completion status to update")
    if "title" in changes:
        if changes["title"] is None or not changes["title"].strip():
            raise HTTPException(422, "Task name cannot be empty")
        changes["title"] = changes["title"].strip()
    if "notes" in changes and changes["notes"] is not None:
        changes["notes"] = changes["notes"].strip()

    columns = {"title", "notes", "completed"}
    assignments = ", ".join(f"{key} = ?" for key in changes if key in columns)
    values = [int(value) if key == "completed" and value is not None else value
              for key, value in changes.items() if key in columns]
    with connect() as db:
        cursor = db.execute(f"UPDATE todos SET {assignments} WHERE id = ?", (*values, todo_id))
        if not cursor.rowcount:
            raise HTTPException(404, "Task not found")
        return serialize(db.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone())


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    with connect() as db:
        cursor = db.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
        if not cursor.rowcount:
            raise HTTPException(404, "Task not found")


@app.post("/api/todos/{todo_id}/move/{direction}")
def move_todo(todo_id: int, direction: str):
    if direction not in ("up", "down"):
        raise HTTPException(400, "Direction must be up or down")
    with connect() as db:
        rows = db.execute("SELECT id, position FROM todos ORDER BY position, id").fetchall()
        ids = [row["id"] for row in rows]
        if todo_id not in ids:
            raise HTTPException(404, "Task not found")
        index = ids.index(todo_id)
        other = index - 1 if direction == "up" else index + 1
        if 0 <= other < len(ids):
            first, second = rows[index], rows[other]
            db.execute("UPDATE todos SET position = ? WHERE id = ?", (second["position"], first["id"]))
            db.execute("UPDATE todos SET position = ? WHERE id = ?", (first["position"], second["id"]))
        return [serialize(row) for row in db.execute("SELECT * FROM todos ORDER BY position, id")]


if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
