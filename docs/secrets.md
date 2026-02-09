# Secrets & Environment Variables

## Source of truth
Production secrets **must** come from AWS Secrets Manager via an IAM role.
At runtime: **IAM role → Secrets Manager → environment variables**.

## Runtime env file (.env.runtime)
Production uses a server-only runtime env file named `.env.runtime`. This file is **required in production** and **must never be committed** to Git. It exists solely to provide the selector values that tell the app which AWS Secrets Manager entry to read at runtime. The actual secrets remain in AWS Secrets Manager, not in this file.

Docker Compose reads `.env.runtime` via `env_file` on the `xproflow-api` service so the container can resolve the correct Secrets Manager payload without hard-coded values in source control.

## Required variables (Secrets Manager payload)
| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL for the API client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used by the API to access Supabase. |
| `SUPABASE_ANON_KEY` | Supabase anon key used by the frontend client. |
| `VITE_SUPABASE_URL` | Supabase URL exposed to the Vite frontend. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key exposed to the Vite frontend. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for Gmail authorization. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI that Google returns to. |
| `ENCRYPTION_KEY` | Base secret used to encrypt stored OAuth tokens. |

## Required variables (runtime configuration)
| Variable | Purpose |
| --- | --- |
| `AWS_SECRET_NAME` | Secrets Manager secret name that contains the JSON payload. |
| `AWS_REGION` | AWS region for Secrets Manager. |

These runtime variables belong in `.env.runtime` on production hosts (EC2). Do not commit `.env.runtime`; use `.env.runtime.example` as a template instead.

## Optional variables
| Variable | Purpose |
| --- | --- |
| `PORT` | API listen port (defaults to `3001`). |
| `SERVER_PORT` | API listen port (falls back to `PORT`). |

## Dev-only variables
None.
