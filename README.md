# EmailAI

## Codex Working Rules
- [WORKING_AGREEMENT.md](WORKING_AGREEMENT.md)
- [TASKS.md](TASKS.md)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)

## Engineering docs
- [Repository architecture](docs/architecture.md)
- [Secrets & environment variables](docs/secrets.md)

## Gmail sync (local development)
1. Copy `.env.example` into `.env` and fill in the required values, plus Supabase auth settings for the frontend.
2. Ensure `GOOGLE_REDIRECT_URI` points to `http://localhost:5173/gmail/callback`.
3. Run the API server:
   ```bash
   cd api
   npm install
   npm run dev
   ```
4. Run the Vite frontend:
   ```bash
   npm install
   npm run dev
   ```
5. Sign in with Google, then connect Gmail from **Integrations** and return to the Inbox.
6. Press **Sync** in the Inbox to fetch and store messages.

### How sync works
- Gmail OAuth is initiated server-side, with `prompt=consent` to capture a refresh token.
- The API exchanges the OAuth code, stores encrypted tokens in `gmail_accounts`, refreshes access tokens when needed, and upserts normalized rows in `inbox_messages`.
- The UI reads from `/api/inbox`, which is backed by Supabase data (not Gmail directly).

### OAuth scopes
- `https://www.googleapis.com/auth/gmail.readonly` is required.
- Add `https://www.googleapis.com/auth/gmail.modify` only if write access is needed.
