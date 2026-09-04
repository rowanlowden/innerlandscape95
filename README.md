# InnerLandscape95

InnerLandscape95 is a Windows 95-inspired personal journaling desktop. The React/Vite client provides the desktop interface, journal, feelings, mood history, blog, themes, and control panel. An Express server is included with a small API endpoint.

## Requirements

Install these before running the project:

- [Git](https://git-scm.com/downloads), if you are cloning the repository
- [Node.js](https://nodejs.org/) 20 or newer, which includes npm
- A modern desktop browser such as Chrome, Firefox, Safari, or Edge

Confirm Node and npm are available:

```sh
node --version
npm --version
```

## Get the project

### Clone with Git

On the repository page, copy its HTTPS URL, then run:

```sh
git clone <repository-url>
cd innerlandscape95
```

For example:

```sh
git clone https://github.com/<owner>/innerlandscape95.git
cd innerlandscape95
```

### Download as a ZIP

On GitHub, select **Code** then **Download ZIP**. Extract the archive, open Terminal, and change into the extracted `innerlandscape95` folder:

```sh
cd /path/to/innerlandscape95
```

## Install dependencies

From the repository root, install the client and server dependencies. Use `npm ci` when the included lockfiles are present; it installs the exact recorded versions.

```sh
cd client
npm ci
cd ../server
npm ci
cd ..
```

Use `npm install` instead only when intentionally updating dependencies or if a lockfile has been removed.

## Start the app

The client and server run as separate processes, so use two Terminal windows or tabs.

In the first terminal, start the API server:

```sh
cd /path/to/innerlandscape95/server
npm run dev
```

The server runs at `http://localhost:3000`. Confirm it is available at `http://localhost:3000/api`, which returns:

```json
{ "message": "Welcome to InnerLandscape95" }
```

In the second terminal, start the Vite client:

```sh
cd /path/to/innerlandscape95/client
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/`.

For a simple non-reloading server process, use `npm start` in `server` instead of `npm run dev`.

To stop either process, focus its terminal and press `Ctrl+C`.

## Restart later

After dependencies have been installed once, reopening the project only requires the two start commands:

```sh
cd /path/to/innerlandscape95/server && npm run dev
```

```sh
cd /path/to/innerlandscape95/client && npm run dev
```

If you pull new changes that modify `client/package.json`, `server/package.json`, or either lockfile, rerun `npm ci` in the affected directory before starting it.

## Available commands

Run these from the indicated directory:

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the development client with hot reload. |
| `client` | `npm run build` | Create an optimized production build in `client/dist`. |
| `client` | `npm run preview` | Serve the production build locally after `npm run build`. |
| `client` | `npm run lint` | Run ESLint over the client source. |
| `server` | `npm run dev` | Start the API with Nodemon, which restarts after server file changes. |
| `server` | `npm start` | Start the API with Node without automatic restart. |

## Local data and moving to another device

Journal entries, Mood History entries, and the selected desktop theme are saved in the browser's `localStorage` under the `innerlandscape95.*` keys. This means they survive page refreshes and browser restarts on the same browser profile, but they are not committed to Git or automatically synced to another device.

Cloning or downloading this repository restores the application code only. Existing journal and mood data must be exported from the original browser or copied manually before clearing browser data, changing profiles, or moving devices. Clearing site data for `localhost:5173` resets the application's locally saved entries and theme.

The current client reads from browser storage rather than the included Express API. The storage adapter is located at `client/src/data/localStorage.js`; it can be replaced with API or database storage when cross-device synchronization is needed.

## Next Steps

Potential additions that build on the current journal, mood, and desktop experience:

### Notepad app

Add a lightweight scratchpad for temporary thoughts, quick lists, and unfinished ideas. Unlike dated journal entries, a note would remain separate from the Blog and could be edited or cleared without affecting reflections or mood history.

### Gratitude mode

Provide a focused three-line gratitude journal with a simple prompt flow. Each check-in could ask for three small things the user appreciates, then save the response as a dedicated gratitude entry for later review.

### Gentle reminders

Let users select a preferred daily journaling time in Control Panel. When the app is open at or after that time, display a small, dismissible desktop reminder that opens a new journal entry.

### Private lock screen

Add an optional passcode or private-session screen before showing personal entries. This should be designed alongside a secure persistence strategy if data later moves beyond browser-local storage to an API or database.

### Daily activity log

Add a clear daily log separate from freeform journal entries. It should offer a quick category selector, optional notes, and completion state for these areas:

| Category | What to track |
| --- | --- |
| Chores | Household tasks, cleaning, laundry, and maintenance. |
| Learning | Reading, coursework, practice, and skill-building. |
| Exercise | Walks, workouts, sports, stretching, and movement. |
| Around town | Errands, appointments, shopping, travel, and other outside tasks. |
| Rest / relax | Breaks, hobbies, social time, sleep routines, and recovery. |

The log could show a daily checklist on the desktop, retain a short history, and contribute a gentle completion summary without treating rest as less important than productivity.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `command not found: node` or `npm` | Install Node.js 20+ and reopen Terminal. |
| Port `5173` or `3000` is already in use | Stop the existing development process with `Ctrl+C`, or use the alternate URL/port Vite reports. |
| `npm ci` fails after editing dependencies | Run `npm install` in that same directory to regenerate its lockfile, then retry. |
| The page does not load | Make sure the client terminal is still running, then open the Vite URL shown in that terminal. |
| Saved journal or mood data is missing | Check that you opened the same browser profile and `localhost` port; localStorage is isolated by browser profile and origin. |