# Secrets & Environment Variables

## Source of truth
Production secrets **must** come from AWS Secrets Manager via an IAM role.
At runtime: **IAM role → Secrets Manager → environment variables**.

## Required variables (Secrets Manager payload)
| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL for the API client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key used by the API to access Supabase. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for Gmail authorization. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI that Google returns to. |
| `TOKEN_ENC_KEY` | Base secret used to encrypt stored OAuth tokens. |

## Required variables (runtime configuration)
| Variable | Purpose |
| --- | --- |
| `AWS_SECRET_NAME` | Secrets Manager secret name that contains the JSON payload. |
| `AWS_REGION` | AWS region for Secrets Manager. |

## Optional variables
| Variable | Purpose |
| --- | --- |
| `PORT` | API listen port (defaults to `3001`). |

## Dev-only variables
None.
