# Repository Architecture

## Folder responsibilities
- `api/`: Backend service (Express + Supabase + OAuth). This is the authoritative API service.
- `src/`: Frontend application (Vite + React).
- `nginx/`: Reverse proxy configuration for routing `/api` to the backend.
- `docs/`: Operational notes, specs, and reference documentation.

> **Legacy note:** The `server/` directory is a legacy prototype kept for reference. It is not part of the current runtime stack and is intentionally left untouched to avoid breaking historical workflows.

## API startup
- **Local dev:** `npm --prefix api run dev`
- **Docker:** `node server/index.js` (see `api/Dockerfile`)

## Docker + nginx flow
1. `xproflow-api` builds from `api/` and exposes port `3001`.
2. `nginx` routes `/api/*` to `http://xproflow-api:3001`.

## n8n integration
n8n is expected to run as a separate service (outside this repo) and communicate with the API over HTTP. Ensure it is configured to target the nginx/API endpoint in the deployment environment.

## Secrets
See `docs/secrets.md` for the single source of truth and AWS Secrets Manager contract.
