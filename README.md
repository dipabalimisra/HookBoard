## HookBoard 

Hookboard — a local webhook tester & mock server (Node.js + Express backend, React frontend).

# Why this is a good fit
- Practical for backend work (debugging webhooks, integrations, 3rd-party callbacks).
- Uses Node.js + Express on backend and React on frontend (matches your skills).
- Small, valuable, and demonstrable within the take-home constraints.

# What Hookboard does (summary)
- Create ephemeral mock endpoints (IDs like /h/:id).
- Inspect and store incoming webhook requests (headers, body, query, timestamp).
- Replay requests or export them as JSON.
- Simple UI to create endpoints, view live incoming requests, and copy example curl/webhook URLs.

# High-level tech & libs
- Backend: Node.js, Express, cors, lowdb (small JSON DB) or an in-memory store, shortid/uuid, body-parser, nodemon (dev).
- Frontend: React (Create React App or Vite + React), axios, simple UI (no heavy UI frameworks required).

# Step-by-step plan to build and run (concise)

1) Create repo and folders
- Create repo locally and two folders: /server and /client.

2) Backend (server)
- Init: cd server; npm init -y
- Install: npm i express cors lowdb shortid
- Dev: npm i -D nodemon
- server/index.js (minimal):
  - Endpoint POST /api/hooks to create a new hook (returns id and URL /h/:id).
  - Endpoint POST /h/:id to receive webhook requests; store { headers, body, query, timestamp } in DB under hook id.
  - Endpoint GET /api/hooks and GET /api/hooks/:id/requests to list stored requests.
  - Simple file DB: lowdb with db.json (persists between runs). Fall back to in-memory if desired.
- Add npm scripts: "dev": "nodemon index.js", "start": "node index.js".

3) Frontend (client)
- Bootstrap: npx create-react-app client (or Vite).
- Main pages:
  - Hooks list + create form (POST /api/hooks).
  - Hook detail: list of requests for that hook, ability to view full JSON, replay (POST to /h/:id with saved body), export JSON.
  - Use polling (every 2s) or socket.io for live updates.
- Proxy API calls in package.json (if CRA): "proxy": "http://localhost:4000" or use absolute URLs.

4) Run locally (example ports)
- Backend: port 4000
- Frontend: port 3000
- Commands (PowerShell):
  - cd server; npm install; npm run dev
  - open new terminal: cd client; npm install; npm start

5) Simple security / constraints
- Only local usage (do not expose on public host unless you know the risk).
- Add .env.example (e.g., PORT=4000) and .gitignore (node_modules, .env, db.json if you prefer).

6) Tests & sanity checks
- Use curl/postman to POST to /h/:id and verify UI shows it.
- Add a simple unit test for the dispatcher if desired.

How to publish the repo (PowerShell)
- git init
- git add .
- git commit -m "Initial commit: Hookboard scaffold"
- git branch -M main
- git remote add origin https://github.com/dipabalimisra/hookboard.git
- git push -u origin main


## Project Structure (recommended)
- /server
  - index.js
  - db.json (lowdb)
  - package.json
- /client
  - src/
  - package.json
- .gitignore
- README.md

## Example server endpoints
- POST /api/hooks -> create a new hook { id, url }
- GET /api/hooks -> list hooks
- GET /api/hooks/:id/requests -> list captured requests
- POST /h/:id -> receives webhook requests (stores them)

## AI Tools Used
- GitHub Copilot (assisted code scaffolding)
- Codex (architecture, more styling and README drafting)
- ChatGPT (For confirming which tool will be suitable for my role )
(Replace or add any others you used.)

## What AI Got Right
- Generated a working Express skeleton and common endpoints.
- Suggested low-effort persistence (lowdb) for prototyping.
- Produced basic React components and API wiring.

## What I Had to Fix
- Adjusted error handling and edge cases (missing hook id, large payloads).
- Reworked data model to avoid race conditions with file writes.
- Rewrote UI polling to use server-sent events/socket.io for reliable updates.

## What I Learned About Vibe Coding
- Use AI to scaffold and iterate quickly, but carefully review persistence and concurrency code.
- Small, well-tested features provide the best value in a short timeframe.

## Screenshots / Demo
- <img width="837" height="566" alt="image" src="https://github.com/user-attachments/assets/3b5d78db-2ac6-4e9e-8f46-c3019580dd09" />
<img width="1060" height="565" alt="image" src="https://github.com/user-attachments/assets/f1c8a856-f2fc-4deb-9ffc-6b5561a10419" />

## Sensitive Info Checklist
- No API keys or real customer data in this repo.
- Add .env to .gitignore.
- Provide .env.example if environment variables are needed.

Optional enhancements (future)
- Public tunneling integration guidance (ngrok) with one-click copy of forwarded URL.
- Authentication for saved endpoints.
- Attachments viewer & body format detection.

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

## Deployment

This project is set up for a split deployment:

- Backend API: Render web service
- Frontend: Vercel static Vite app

### Deploy Backend To Render

1. Push this repository to GitHub.
2. Open the Render Dashboard.
3. Choose New > Blueprint.
4. Connect the GitHub repository.
5. Render will read `render.yaml` from the repository root.
6. Deploy the `hookboard-api` service.

The backend service uses:

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`

After deployment, copy the Render URL. (https://hookboard-api.onrender.com)


### Deploy Frontend To Vercel

1. Open the Vercel Dashboard.
2. Choose Add New > Project.
3. Import the same GitHub repository.
4. Set the project root directory to `Frontend_react`.
5. Add this environment variable:

VITE_API_BASE_URL=https://hookboard-api.onrender.com

6. Deploy.

The frontend uses `Frontend_react/vercel.json` for the Vite build settings.

### Deployment Notes

- Render provides the production `PORT` automatically.
- Vercel must receive `VITE_API_BASE_URL` before building, because Vite embeds environment variables at build time.
- Render free services can sleep after inactivity, so the first request after a pause may take a little longer.
- The backend currently stores webhook data in `Backend/db.json`. On free ephemeral hosting, this data may reset across redeploys or instance restarts.

## Notes

- Do not commit `node_modules`, `dist`, `.env`, or `Backend/db.json`.
- Keep the backend running before testing frontend API actions.
- If the frontend shows API errors, confirm that `VITE_API_TARGET` matches the backend URL.
