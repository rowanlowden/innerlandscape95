# InnerLandscape95

A Windows 95-inspired journaling desktop built with React and Vite.

## Run locally

From the repository root, install dependencies once in each project:

```sh
cd client && npm install
cd ../server && npm install
```

Start the API in one terminal:

```sh
cd server
npm run dev
```

Start the desktop app in another terminal:

```sh
cd client
npm run dev
```

Open `http://localhost:5173/` in a browser.

## Local data

Journal entries, Mood History entries, and the selected desktop theme are stored in the browser's `localStorage`. They remain after refreshes and browser restarts on that device. The data is not automatically synced between computers; the storage adapter lives in `client/src/data/localStorage.js` so it can later be replaced with the Express API or a database.