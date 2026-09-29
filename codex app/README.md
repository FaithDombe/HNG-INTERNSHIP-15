# Little List

A simple React todo list with notes, editing, completion, reordering, and deletion.

## Run it on Windows

1. Install Node.js LTS if it is not installed already.
2. Open this folder in File Explorer and double-click `start.ps1`.
3. Keep the PowerShell window open, then open http://localhost:5173 in your browser.
4. To stop the app, click the PowerShell window and press Ctrl+C.

If Windows says running scripts is disabled, open PowerShell in this folder, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then run `./start.ps1`.

## Where tasks are saved

Tasks are saved in this browser on this computer. They stay after you refresh the page, but they do not sync to another browser or device. Clearing this browser's site data removes them. The React app does not need a Python server or database.

## Publish the React app

The `frontend` folder is a static Vite website, so it can be hosted by Vercel or Netlify without a Python server.

1. Push this project to GitHub.
2. In Vercel or Netlify, create a new site from the GitHub repository.
3. Set the project/base directory to `codex app/frontend`.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Deploy. Each visitor will have their own separate task list saved in their browser.
