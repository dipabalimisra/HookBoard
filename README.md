# HookBoard

HookBoard is a small webhook inspection app. Create webhook endpoints, send test payloads, inspect captured requests, and export request history as JSON.

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Storage: LowDB JSON file

## Project Structure

```text
HookBoard/
  Backend/          Express API and webhook receiver
  Frontend_react/   React + Vite frontend
```

## Requirements

- Node.js 20 or newer
- npm

## Local Setup

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend_react
npm install
```

## Run Locally

Start the backend:

```bash
cd Backend
npm run dev
```

By default, the backend runs on `http://localhost:5000`.

Start the frontend in a second terminal:

```bash
cd Frontend_react
npm run dev
```

By default, Vite runs on `http://localhost:5173`. If that port is already busy, Vite will automatically choose the next available port.

## Port Configuration

If backend port `5000` is already in use, start the backend on another port:

```bash
cd Backend
$env:PORT=5001
npm run dev
```

Then point the frontend proxy to that backend port:

```bash
cd Frontend_react
$env:VITE_API_TARGET="http://localhost:5001"
npm run dev
```

You can also copy the example environment files and edit them:

```bash
copy Backend\.env.example Backend\.env
copy Frontend_react\.env.example Frontend_react\.env
```

## Production Build

Build the frontend:

```bash
cd Frontend_react
npm run build
```

Start the backend:

```bash
cd Backend
npm start
```

## Data Storage

The backend creates `Backend/db.json` automatically at runtime. This file is ignored by git because it contains local captured webhook data.

## GitHub Upload

From the repository root:

```bash
git init
git add .
git commit -m "Initial HookBoard project"
```

Create a new empty repository on GitHub, then connect and push:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub account and repository name.

## Notes

- Do not commit `node_modules`, `dist`, `.env`, or `Backend/db.json`.
- Keep the backend running before testing frontend API actions.
- If the frontend shows API errors, confirm that `VITE_API_TARGET` matches the backend URL.
