# HNG-INTERNSHIP-15

A simple, accessible **Todo List** web app built with **React 19** and **Vite 8**.

## Features

- ➕ Add tasks — press `Enter` or click **Add**; whitespace-only input is rejected with an inline hint
- ✅ Mark tasks complete / incomplete
- ✎ Edit a task inline — double-click the text or click the pencil button (`Enter` saves, `Esc` cancels, blurring saves)
- ✕ Delete a single task
- 🧹 Clear all completed tasks in one click
- 🔍 Filter by **All / Active / Completed**
- 🔢 Live remaining-task counter
- 💾 Saves to `localStorage`, so tasks survive a page reload
- 🌗 Light and dark themes via `prefers-color-scheme`
- ♿ Keyboard accessible, labelled controls, live regions for status messages
- 📱 Responsive down to small phone widths

## Package manager: npm

This project uses **npm**, declared in the `devEngines` field of `package.json`.
npm honours that field, and other managers that understand `devEngines` (pnpm,
Yarn) will refuse to install here — so please don't mix managers in this repo.

| Task                                                     | Command                  |
| -------------------------------------------------------- | ------------------------ |
| Install exactly what the lockfile pins (fresh clone, CI)  | `npm ci`                 |
| Install / refresh dependencies                            | `npm install`            |
| Add a runtime dependency                                  | `npm install <pkg>`      |
| Add a dev dependency                                      | `npm install -D <pkg>`   |
| Remove a dependency                                       | `npm uninstall <pkg>`    |

> **Commit `package-lock.json`.** It is not in the repo yet because this project was
> scaffolded by hand on a machine with no Node.js installed. Run `npm install` once to
> generate it, then commit it — the lockfile is what makes installs reproducible for
> everyone (and what deployment platforms read to pick npm). `.gitignore` only ignores
> `node_modules`, so the lockfile stays tracked.

## Requirements

- **Node.js `^20.19.0 || >=22.12.0`** — required by Vite 8
- **npm 10 or newer** — ships with every supported Node.js version

```bash
node -v   # check Node
npm -v    # check npm
```

No Node.js yet? Installing it gives you npm too:

```powershell
winget install OpenJS.NodeJS.LTS   # Windows
```

```bash
brew install node                  # macOS (Homebrew)
sudo apt install nodejs npm        # Debian / Ubuntu
```

## Getting started

```bash
# 1. install dependencies (also creates package-lock.json)
npm install

# 2. start the dev server (opens http://localhost:5173)
npm run dev
```

## Scripts

| Script            | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite dev server with hot module replacement        |
| `npm run build`   | Builds a production bundle into `dist/`                       |
| `npm run preview` | Serves the built `dist/` folder locally to check the output   |

## Project structure

```
.
├── index.html                    # Vite HTML entry point
├── vite.config.js                # Vite + React plugin config
├── public/
│   └── favicon.svg               # Static asset, copied as-is to the build
└── src/
    ├── main.jsx                  # React root, mounts <App /> into #root
    ├── App.jsx                   # Layout + filtering + derived counts
    ├── App.css                   # Component styles
    ├── index.css                 # Theme tokens, reset, global styles
    ├── constants.js              # Filter definitions shared across components
    ├── hooks/
    │   └── useTodos.js           # Todo state + localStorage persistence
    └── components/
        ├── TodoForm.jsx          # Add-task form with validation hint
        ├── TodoFilters.jsx       # Filter chips, counter, clear-completed
        ├── TodoList.jsx          # Renders the list or an empty state
        └── TodoItem.jsx          # One row: toggle, edit, delete
```

## How it works

- `useTodos` is the single source of truth. It seeds React state from `localStorage`
  (validating each stored record) and writes the list back on every change, so the
  UI and storage never drift apart.
- `App.jsx` owns only the active filter; the visible list and the task counters are
  derived with `useMemo`.
- Each `TodoItem` owns its own edit-mode state, which keeps the parent simple and
  avoids re-rendering the whole list while typing.

## Deployment

`npm run build` produces a static `dist/` folder that can be deployed to any static
host (Vercel, Netlify, GitHub Pages, etc.).

- **Install command:** `npm ci` (uses the committed `package-lock.json`)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Local data:** tasks are stored per-browser in `localStorage`, so they are not
  shared between devices or browsers.

## License

[MIT](./LICENSE) © Faith Dombe
