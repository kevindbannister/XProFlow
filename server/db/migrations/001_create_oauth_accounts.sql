CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  email TEXT,
  tenant_id TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS oauth_accounts_user_provider_idx ON oauth_accounts (user_id, provider);
