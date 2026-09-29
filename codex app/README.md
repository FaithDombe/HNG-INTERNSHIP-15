# Little List

A beginner-friendly todo app: React in the browser, a Python FastAPI API, and SQLite for storage. Tasks support notes, editing, completion, reordering, and deletion.

## Run it on Windows

1. Install Python 3.10 or newer and Node.js LTS.
2. Open this folder in File Explorer and double-click `start.ps1`.
3. The first run installs the app packages. Keep the server windows open while using the app.
4. The app opens at http://localhost:5173.

If PowerShell says running scripts is disabled, in the same PowerShell window run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then run `./start.ps1`.

Tasks are saved in `backend/todos.db` on this computer. API documentation is at http://localhost:8000/docs.

## Publish a public demo on Render

The repository includes a Dockerfile that builds the React site and runs it with the FastAPI server.

1. Sign in to Render using the GitHub account that can access `FaithDombe/HNG-INTERNSHIP-15`.
2. Choose **New +** > **Web Service**, then connect that repository.
3. Set **Root Directory** to `codex app` and **Runtime** to Docker. Select the Free plan for a demonstration.
4. Create the web service. When the deploy finishes, Render shows the public URL at the top of its page.

This demo has no sign-in: anyone with the URL can view and change the same list. The free service's SQLite file is temporary and may be erased when the service restarts or redeploys. Do not use it for private or important tasks. Keeping SQLite data between restarts requires a paid persistent disk.
