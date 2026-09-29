# Little List

A beginner-friendly todo app: React in the browser, a Python FastAPI API, and SQLite for storage. Tasks support notes, editing, completion, reordering, and deletion.

## Run it on Windows

1. Install Python 3.10 or newer and Node.js LTS.
2. Open this folder in File Explorer and double-click `start.ps1`.
3. The first run installs the app packages. Keep the server windows open while using the app.
4. The app opens at http://localhost:5173.

If PowerShell says running scripts is disabled, in the same PowerShell window run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then run `./start.ps1`.

Tasks are saved in `backend/todos.db` on this computer. API documentation is at http://localhost:8000/docs.

## Public hosting notes

The React production build is served by FastAPI, so one web service can host both. Build the frontend with `cd frontend && npm install && npm run build`; then start the API with `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`.

For a host such as Render, set the repository root directory to `codex app`, use the build command `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`, and the start command `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`. Set `TODO_DB_PATH=/var/data/todos.db` and mount a persistent disk at `/var/data` to keep the SQLite database between restarts and deployments.

The current app has no sign-in: a public deployment would give every visitor access to the same tasks and notes. Add authentication before putting private information in it. Render's free web services do not preserve SQLite files; persistent disks require a paid web service.
