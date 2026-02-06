# Secrets & Environment Variables

## Source of truth
Production secrets **must** come from AWS Secrets Manager via an IAM role.
At runtime: **IAM role → Secrets Manager → environment variables**.
A `.env` file is optional for local development and must never be committed.

## Required variables (Secrets Manager)
| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL for the API client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used by the API to access Supabase. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for Gmail authorization. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI that Google returns to. |
| `TOKEN_ENC_KEY` | Base secret used to encrypt stored OAuth tokens. |

## Optional variables
| Variable | Purpose |
| --- | --- |
| `PORT` | API listen port (defaults to `3001`). |

## Dev-only variables
None. Local development can supply the required variables via `.env`.
