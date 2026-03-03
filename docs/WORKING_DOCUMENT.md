# XProFlow Working Document (Current App Snapshot)

## 1) Product scope (what is live in this repo)
XProFlow is a React + Vite SaaS app with an Express API. The current codebase supports:

- Supabase-authenticated app access (Google OAuth + optional local manual auth fallback for development).
- Inbox workflows backed by synced Gmail metadata in Supabase.
- Firm-aware user context (users, firms, roles) and role-gated API operations.
- Billing/subscription lifecycle via Stripe Checkout + webhook updates.
- Professional context capture (user/org context used for writing and workflow personalization).
- Feature flag management with Supabase persistence + disk fallback.

---

## 2) Frontend application map (`src/`)

### 2.1 App bootstrap and providers
- `src/main.tsx` composes `BrowserRouter`, `AppProvider`, `AuthProvider`, and `UserProvider`.
- `src/context/AppContext.tsx` hydrates Supabase session + user row (`users`) + firm row (`firms`).
- `src/context/AuthContext.tsx` handles session checks against `/api/me`, Gmail connection metadata, subscription visibility, and app-access gating.
- `src/context/UserContext.tsx` manages local profile presentation data (name/avatar persistence).

### 2.2 Route inventory (`src/App.tsx`)
Public routes:
- `/login`
- `/signup`
- `/auth/callback`

Authenticated shell (`AppLayout` + `RequireAuth`):
- `/billing`
- `/dashboard`
- `/inbox`
- `/email-setup`
- `/onboarding`
- `/onboarding/professional-context`
- `/labels`
- `/rules`
- `/integrations`
- `/workflows`
- `/settings/drafts`
- `/writing-style`
- `/signature-time-zone`
- `/account-settings`
- `/settings/professional-context`
- `/settings/firm`
- `/profile`

Notes:
- Most product routes are wrapped with `RequireProductAccess`, which redirects to `/billing` when subscription status is not allowed.
- Default route redirects to `/dashboard`.

### 2.3 Frontend feature modules
- `src/pages/Inbox.tsx` + `src/components/inbox/*`: list/detail inbox UI consuming `/api/inbox`.
- `src/pages/Billing.tsx` + `src/lib/billing.ts`: displays subscription status and checkout entry points.
- `src/components/professional/ProfessionalContextForm.tsx` + `src/lib/professionalContextApi.ts`: CRUD for professional context endpoints.
- `src/pages/settings/*`: account/writing/signature/firm/professional-context settings surfaces.
- `src/lib/api.ts`: centralized API client with auth header injection.

---

## 3) Backend application map (`api/server/`)

### 3.1 Server bootstrap
`api/server/index.js`:
- Loads runtime secrets from AWS Secrets Manager (`bootstrap/secrets.js`).
- Initializes Supabase admin and anon clients.
- Applies strict configured CORS (`FRONTEND_URL` fallback).
- Applies request ID logging middleware.
- Registers route modules.
- Exposes health endpoints (`/health`, `/api/health`) and encryption debug endpoint (`/debug/encryption-test`).

### 3.2 Auth and authorization
- `auth/supabaseAuth.js`: bearer token parsing + user lookup + `requireUser` helper.
- `middleware/requireRole.js`: role-based guards for owner/admin operations.
- `middleware/internalApiAuth.js` + `requireInternalApiKey.js`: internal key auth for system-only endpoints.

### 3.3 Active route modules
- `routes/session.js`
  - `GET /api/me`
  - `POST /auth/google/disconnect`
  - `POST /auth/logout`
- `routes/gmail.js`
  - `GET /api/gmail/status`
  - `POST /api/gmail/sync`
  - `POST /api/gmail/move` (internal auth)
  - `GET /api/gmail/fetch-new` (internal auth)
- `routes/inbox.js`
  - `GET /api/inbox`
- `routes/featureFlags.js`
  - `GET /api/feature-flags`
  - `PUT /api/feature-flags` (master-only)
- `routes/signup.js`
  - `POST /api/auth/signup`
- `routes/billing.js`
  - `POST /api/billing/checkout-session`
  - `POST /api/billing/webhook`
  - `GET /api/billing/subscription`
- `routes/firm.js`
  - `POST /api/firm/invite`
  - `POST /api/firm/invite/accept`
  - `DELETE /api/firm/users/:id`
- `routes/professionalContext.js`
  - `GET /api/professional-context`
  - `PUT /api/professional-context`
- `routes/email.js`
  - email workflow endpoints mounted under `/api/email/*`

Legacy compatibility route module still present:
- `auth/google.js` registers `/auth/google` and `/auth/google/callback`.

---

## 4) Data and integrations (current behavior)

### 4.1 Core external services
- Supabase Auth + Postgres for identity, org/user/firms data, Gmail metadata, settings context.
- Google Gmail API for sync + label operations.
- Stripe for checkout/subscription lifecycle.
- AWS Secrets Manager for runtime secret hydration in deployed API environments.

### 4.2 Subscription gating
- Subscription states normalized in `services/subscriptions.js`.
- Frontend allows product access when status is `trial`, `active`, or `past_due`; otherwise users are routed to billing.

### 4.3 Professional context model
- User-level and org-level writing context persisted through:
  - `professional_context_user`
  - `professional_context_org`
- Defaults are applied server-side when records do not yet exist.

### 4.4 Gmail sync model
- Gmail account linkage data and synced message metadata are stored in Supabase.
- Inbox API groups and returns synced records for UI consumption.
- Internal-only routes support server-to-server operations for moving/fetching new mail.

---

## 5) Deployment and runtime notes
- Frontend runs on Vite (local) and is buildable as static assets.
- API runs as Node/Express service (`api/server/start.js` → `index.js`).
- Docker + nginx config exists at repo root for reverse-proxy deployment.
- API expects env/runtime secrets for Supabase, Google OAuth, Stripe, and encryption.

---

## 6) Known architecture realities to keep in mind
- Legacy Google auth paths and newer Gmail account flows coexist.
- Session endpoint checks both `gmail_accounts` and `connected_accounts` to infer current Gmail connection state.
- Feature flags can persist in Supabase and fall back to local disk if DB operations fail.
- `debug/encryption-test` is still exposed and should be considered for environment-based restriction in production hardening.

