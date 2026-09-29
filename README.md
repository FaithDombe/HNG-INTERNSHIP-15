# Little List

A simple React todo list with notes, editing, completion, reordering, and subtasks. Tasks are saved in the current browser using local storage.

## Run locally on Windows

1. Install Node.js LTS if it is not installed.
2. Double-click `start.ps1` from the repository root.
3. Open http://localhost:5173.
4. Keep the PowerShell window open while using the app. Press Ctrl+C there to stop it.

If PowerShell blocks scripts, open PowerShell in the repository root, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then run `./start.ps1`.

You can also run the app from the repository root with `npm ci` followed by `npm run dev`.

## Deploy to Vercel

This is one Vite app at the repository root. Import the repository in Vercel and leave **Root Directory** at the repository root. Vercel detects Vite automatically; use `npm run build` and `dist` if the build settings need to be entered manually.

Each browser keeps its own task list. Tasks do not sync between browsers or devices.
