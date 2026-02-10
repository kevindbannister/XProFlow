# XProFlow Working Architecture Document

## 1) Executive Overview
XProFlow (also referred to as EmailAI / Flowiee in docs) is a full-stack email triage workspace focused on accounting teams. The current implementation consists of:

- A **React + Vite frontend** for authenticated user workflows (Inbox, Integrations, Profile, Settings, etc.).
- An **Express API backend** that brokers Gmail OAuth, token management, inbox synchronization, and session checks.
- **Supabase** used for authentication and persistence (OAuth identities, Gmail accounts, inbox messages).
- **AWS Secrets Manager integration** in the API bootstrap path for secure runtime configuration on EC2.
- **Containerized deployment pattern** via Docker Compose with optional nginx reverse proxy and external n8n service.

---

## 2) Repository Structure and File Responsibilities

## Root
- `README.md`: setup and Gmail sync flow.
- `docker-compose.yml`: multi-service runtime (API + nginx + n8n), designed for host deployments.
- `package.json`: frontend scripts and dependencies.
- `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `eslint.config.js`, `tsconfig*.json`: build/tooling configuration.
- `.env.example`, `.env.runtime.example`: local/dev and runtime env templates.
- `nginx/`: reverse proxy config for `/api` forwarding.
- `supabase/migrations/`: SQL schema + RLS policies.
- `docs/`: architecture/spec/style/convention docs.

## Frontend (`src/`)
- `main.tsx`: app bootstrap with `BrowserRouter`, `AuthProvider`, `UserProvider`.
- `App.tsx`: route tree and auth-guarded shell.
- `context/`:
  - `AuthContext.tsx`: Supabase OAuth state + API session check + login/logout helpers.
  - `UserContext.tsx`: persisted profile state and session-driven user hydration.
- `lib/`:
  - `api.ts`: typed fetch helper adding Supabase bearer token.
  - `supabaseClient.ts`: Supabase browser client initialization from Vite env.
  - `userProfile.ts`: profile derivation/avatar URL helpers.
  - `settingsData.ts`, `mockData.ts`, `constants.ts`: product data definitions and mock fixtures.
  - `designTokens.ts`, `utils.ts`: visual tokens and utility helpers.
- `pages/`: route-level UI pages (Inbox, Integrations, Login, Auth callback, Profile, etc.).
- `components/`:
  - `layout/`: app shell, sidebar, topbar.
  - `ui/`: reusable presentational primitives.
  - `inbox/`, `dashboard/`, `profile/`: feature-level views.
- `types/` and `shared/types/`: typed contracts for inbox/settings/user domains.

## Backend (`api/`)
- `server/start.js`: process entrypoint.
- `server/index.js`: app bootstrap, middleware, route registration, health/debug endpoints.
- `server/bootstrap/secrets.js`: loads JSON secrets from AWS Secrets Manager into `process.env`.
- `server/supabaseClient.js`: singleton Supabase service-role client.
- `server/encryption/index.js`: AES-256-GCM token encryption/decryption helpers.
- `server/auth/`:
  - `supabaseAuth.js`: bearer-token user extraction and auth enforcement.
  - `google.js`: legacy Google auth routes storing `connected_accounts`.
- `server/google/`:
  - `oauth.js`: OAuth client creation, code exchange, refresh handling, userinfo fetch.
  - `gmail.js`: Gmail API wrappers (list messages, metadata, profile).
- `server/routes/`:
  - `session.js`: `/api/me`, disconnect, logout.
  - `gmail.js`: Gmail connect/status/oauth/sync flows.
  - `inbox.js`: normalized inbox query + day/month grouping.

---

## 3) End-to-End Architecture

```text
[Browser React App]
   |  (Supabase OAuth + JWT)
   |  Authorization: Bearer <access_token>
   v
[Express API on EC2]
   |-- loadSecrets() -> AWS Secrets Manager
   |-- validate user via Supabase auth.getUser(token)
   |-- Gmail OAuth exchange/refresh via Google APIs
   |-- encrypt/decrypt Gmail tokens
   v
[Supabase Postgres + Auth]
   |-- gmail_accounts (encrypted tokens)
   |-- inbox_messages (normalized message rows)
   v
[UI reads /api/inbox grouped data]
```

Key behavior:
1. User signs in via Supabase Google OAuth in frontend.
2. Frontend obtains session token and calls API with bearer token.
3. API validates token with Supabase Admin API.
4. Gmail account can be connected through API OAuth endpoints.
5. API sync job fetches Gmail metadata, normalizes fields, upserts into `inbox_messages`.
6. UI reads persisted rows from API (`/api/inbox`) rather than calling Gmail directly.

---

## 4) Frontend Subsystems

### 4.1 Routing and Protected Shell
- `App.tsx` wraps authenticated pages in `RequireAuth` and `AppShell`.
- `/login` and `/auth/callback` are public.
- Primary operational route is `/inbox`; many placeholder/product pages are scaffolded.

### 4.2 Authentication Flow (Frontend)
- `AuthContext` combines:
  - Supabase session state (`supabase.auth.getSession`, `onAuthStateChange`).
  - Backend session validation (`GET /api/me`).
  - Gmail connectivity metadata (`gmailConnected`, `gmailEmail`).
- Google sign-in uses `supabase.auth.signInWithOAuth` with:
  - scope: Gmail readonly,
  - `access_type=offline`,
  - `prompt=consent`,
  - redirect to `/auth/callback`.
- Includes a development-only manual login fallback (`master/master`) persisted in local storage.

### 4.3 API Client Layer
`src/lib/api.ts` centralizes HTTP behavior:
- Auto-injects `Authorization: Bearer <supabase_access_token>` if session exists.
- Sends JSON request body and handles `204` responses.
- Throws on non-OK responses.

### 4.4 UI Composition
- `components/layout/*` define persistent sidebar/topbar + content outlet.
- `components/ui/*` provide composable primitives (`Button`, `Card`, `Input`, etc.).
- Inbox module uses `ThreadList` and `ThreadDetail` for list/detail workspace pattern.
- Styling is mostly Tailwind utility classes plus CSS variable theme tokens in `src/styles/index.css`.

### 4.5 User Profile State
- `UserContext` hydrates profile from Supabase session user and persists custom edits in local storage.
- Avatar strategy is deterministic via helper methods in `lib/userProfile.ts`.

---

## 5) Backend Subsystems (Express on EC2)

### 5.1 Startup + Secrets Bootstrap
At process start (`server/index.js`):
1. `loadSecrets()` attempts pull from AWS Secrets Manager using `AWS_SECRET_NAME` + `AWS_REGION`.
2. Supabase service-role client is initialized.
3. Route modules are registered.
4. Health routes exposed (`/health`, `/health/supabase`, encryption debug).

This enables a runtime contract where EC2 instance roles retrieve secrets without storing credentials in repo.

### 5.2 Auth Enforcement
`requireUser()` extracts bearer token and validates through `supabase.auth.getUser(token)`. Any missing/invalid token returns `401`.

### 5.3 Gmail OAuth + Sync Lifecycle
`routes/gmail.js` handles the core workflow:

1. **Start OAuth**
   - `GET /api/gmail/oauth/start` (also `/gmail/oauth/start`).
   - Builds Google authorization URL with required scopes.
   - Uses referer-derived state for safe same-origin return.

2. **OAuth callback**
   - `GET /api/gmail/oauth/callback` (also `/gmail/oauth/callback`).
   - Exchanges code for tokens.
   - Fetches Gmail profile email.
   - Encrypts and upserts account tokens into `gmail_accounts`.
   - Redirects UI to integrations/inbox with status query params.

3. **Manual connect endpoint**
   - `POST /api/gmail/connect` accepts auth `code` in body and persists tokens.

4. **Sync endpoint**
   - `POST /api/gmail/sync?folder=INBOX|PROMOTIONS|DRAFT|SPAM|TRASH|ALL`
   - Decrypts stored token, refreshes if expired, reads Gmail message metadata,
   - Normalizes fields, upserts into `inbox_messages` (conflict by user/provider/external id).

### 5.4 Inbox Read API
`GET /api/inbox?folder=INBOX`:
- Reads message rows scoped to current user.
- Sorts by `received_at desc`.
- Groups into `{ today, thisMonth, older }` buckets for UI consumption.

### 5.5 Session API
`GET /api/me`:
- Returns authentication status and Gmail connected status for current user.

`POST /auth/google/disconnect`:
- Deletes current user’s `gmail_accounts` rows.

`POST /auth/logout`:
- Returns `204`; frontend also executes Supabase sign-out.

---

## 6) API Endpoint Catalog

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/health` | No | None | `{status:'ok'}` |
| GET | `/health/supabase` | No | None | Supabase connectivity metadata |
| GET | `/debug/encryption-test` | No | None | encryption/decryption self-test |
| GET | `/api/me` | Bearer | None | `{authenticated,user?,gmail?}` |
| POST | `/auth/logout` | Optional | None | `204` |
| POST | `/auth/google/disconnect` | Bearer | None | `204` |
| GET | `/api/gmail/oauth/start` | Bearer | optional referer/state | Redirect to Google OAuth |
| GET | `/api/gmail/oauth/callback` | Bearer | `code`, `state` | Redirect with success/error params |
| GET | `/api/gmail/authorize` | Bearer | None | `{url}` |
| POST | `/api/gmail/connect` | Bearer | `{code}` | `{connected,email}` |
| GET | `/api/gmail/status` | Bearer | None | `{connected,email?}` |
| POST | `/api/gmail/sync` | Bearer | query `folder` | `{messages:[...]}` |
| GET | `/api/inbox` | Bearer | query `folder` | `{today:[],thisMonth:[],older:[]}` |
| GET | `/auth/google` | No | None | Legacy redirect |
| GET | `/auth/google/callback` | No | `code` | Legacy JSON response |

Notes:
- Two `/api/gmail/status` handlers exist in the same file; the latter registration wins behaviorally in Express order and effectively shadows earlier logic.
- Legacy `/auth/google*` routes write to `connected_accounts`, while main app flow uses `gmail_accounts`.

---

## 7) Data Models and Persistence

## 7.1 `gmail_accounts` (Supabase)
Used by current Gmail integration flow.
- `user_id` (auth.users FK)
- `email`
- `provider` (gmail/google depending migration path)
- `access_token` (encrypted)
- `refresh_token` (encrypted)
- `expiry_ts`
- timestamps

RLS policies enforce per-user CRUD access.

## 7.2 `inbox_messages`
Normalized message snapshot table.
- identity: `external_id` + `provider` + `user_id` unique index
- metadata: sender, subject, snippet, thread, folder
- temporal: `internal_date`, `received_at`
- state: `is_unread`, `status`

## 7.3 Legacy `connected_accounts`
Referenced by:
- `api/server/auth/google.js`
- `/health/supabase` check

But this table is not created in current migrations in this repository, indicating either external provisioning or drift.

---

## 8) Key Algorithms and Transformations

### 8.1 Header Parsing
`parseFromHeader()` extracts sender display name and email from RFC-like `From` header.

### 8.2 Message Normalization
`normalizeMessage()` maps Gmail metadata into DB row shape:
- `From`, `Subject`, `Date` headers
- `internalDate` conversion
- unread status via Gmail labels
- computed status mapping (`READ` / `NONE`)

### 8.3 Token Lifecycle Handling
On sync:
- decrypt access/refresh tokens,
- compare expiry,
- refresh access token if stale,
- persist updated encrypted token and expiry.

### 8.4 Inbox Grouping
`isSameDay()` and `isSameMonth()` bucket messages for UI rendering convenience.

---

## 9) Security and Authentication Design

Implemented controls:
- Bearer-token API auth enforced through Supabase token validation.
- OAuth tokens encrypted at rest using AES-256-GCM with runtime `ENCRYPTION_KEY`.
- Gmail OAuth state sanitization ensures internal relative-path redirects only.
- Supabase row-level security policies for per-user data boundaries.
- Secrets loaded at runtime from AWS Secrets Manager in EC2-style deployment.

Potential gaps:
- `csrfToken` is referenced by frontend context, but no CSRF issuance/validation appears in backend routes.
- `/debug/encryption-test` exposes cryptographic test endpoint in runtime; should likely be disabled outside development.
- Legacy and current auth paths coexist, increasing attack surface and maintenance complexity.

---

## 10) Deployment and Infrastructure

## 10.1 Local Development
- Frontend: `npm run dev` on Vite default port 5173.
- API: `npm --prefix api run dev` on port 3001.

## 10.2 Container Runtime
Root `docker-compose.yml` defines:
- `xproflow-api` built from `/api` with `.env.runtime` and AWS selector vars.
- `nginx` reverse proxy exposing port `80` and forwarding `/api` to API container.
- `n8n` workflow container with persistent volume.

## 10.3 EC2 + AWS Secrets Manager
The API expects EC2 runtime role permissions for `secretsmanager:GetSecretValue`.
`loadSecrets()` maps JSON payload values into process environment at startup.

## 10.4 CI/CD
Current GitHub Actions workflow deploys frontend static build to GitHub Pages (`dist`).
This is separate from the API/EC2 deployment model.

---

## 11) External Integrations
- **Supabase Auth + Postgres**: identity, token verification, storage.
- **Google OAuth + Gmail APIs**: account linking and message metadata sync.
- **AWS Secrets Manager**: secure runtime secret delivery.
- **n8n (external service)**: documented as separate workflow automation service.

---

## 12) How Files Relate Across Layers

```text
Frontend (src/context/AuthContext.tsx)
  -> src/lib/api.ts
    -> GET /api/me, POST /auth/logout, Gmail endpoints
      -> api/server/routes/session.js + routes/gmail.js
        -> api/server/auth/supabaseAuth.js
          -> Supabase Auth user validation
        -> api/server/google/oauth.js + google/gmail.js
        -> api/server/encryption/index.js
        -> Supabase tables gmail_accounts / inbox_messages

Frontend Inbox page
  -> /api/inbox
    -> routes/inbox.js (group today/thisMonth/older)
```

---

## 13) Developer UX and Usage Notes

- Prefer using `src/lib/api.ts` for all backend calls (keeps auth headers consistent).
- Bearer token currently comes from Supabase session only; ensure app has valid Supabase client env values.
- For Gmail integration testing:
  1. login via Google in frontend,
  2. call connect flow from Integrations,
  3. run sync,
  4. verify rows in `inbox_messages` and UI grouping.
- If running API in production-like mode, ensure `.env.runtime` contains only `AWS_REGION` + `AWS_SECRET_NAME`; secrets should come from AWS payload.

---

## 14) Summary Findings

## What the app does (high-level)
XProFlow provides an authenticated email triage interface where users connect Gmail, synchronize message metadata into Supabase, and work from a grouped Inbox UI rather than directly querying Gmail from the browser.

## Missing pieces / inconsistencies / potential issues
1. **Route duplication**: `/api/gmail/status` appears twice in the same route module.
2. **Schema drift risk**: legacy `connected_accounts` table is still referenced in code and health checks but not created by current migrations.
3. **Mixed auth paradigms**: current flow uses Supabase OAuth + gmail_accounts while legacy `/auth/google` routes remain active.
4. **CSRF mismatch**: frontend expects csrf token handling but backend does not generate/verify it.
5. **Debug endpoint exposure**: encryption test endpoint may be unsafe for non-dev environments.
6. **CI/deployment split**: workflow deploys static frontend to GitHub Pages while backend docs target EC2 containers; unified release process is not codified.

## Recommendations
1. Consolidate on one OAuth integration path and remove legacy `/auth/google` + `connected_accounts` dependencies.
2. Add a migration (or remove references) for `connected_accounts` to eliminate runtime ambiguity.
3. Remove duplicate `/api/gmail/status` route and keep a single authoritative implementation.
4. Either implement CSRF fully (token issue + verification) or remove dead client expectations.
5. Gate debug routes behind environment checks.
6. Add OpenAPI/Swagger spec and automated endpoint tests for session, Gmail sync, and inbox grouping.
7. Create explicit EC2 deployment docs (systemd/nginx/docker compose lifecycle, health checks, rollback, secrets rotation).
8. Add background sync strategy (cron/queue/webhook) instead of manual sync-only UX.

