# XProFlow AI System Context

## Project Overview

XProFlow is an AI-powered email workflow automation platform for accountants and finance professionals.

The system connects to Gmail accounts, ingests emails, classifies them using AI, and triggers automated workflows.

Typical automation actions include:

• labeling emails  
• moving emails to folders  
• generating tasks  
• extracting documents  
• triggering downstream workflows  

The platform is built as a **multi-tenant SaaS system**.

Each user has their own Gmail connection and token storage.


---

# Core Architecture

Frontend  
Next.js application hosted on Cloudflare Pages.

Backend API  
Node.js / Express service running in Docker.

Database  
Supabase PostgreSQL.

Workflow Engine  
n8n running in Docker.

Infrastructure  
AWS EC2 (Amazon Linux).

Reverse Proxy  
Nginx.


---

# Domains

Typical deployment:

app.xproflow.com → Next.js frontend  
api.xproflow.com → Node backend API  
n8n.xproflow.com → n8n workflow engine


---

# System Request Flow

User logs into application  
↓  
Supabase Auth issues JWT  
↓  
Frontend sends JWT to Node API  
↓  
Node API validates Supabase JWT  
↓  
Node API retrieves user_id  
↓  
User-specific resources are accessed

Examples:

• Gmail tokens  
• labels  
• email data  
• workflow events


---

# Authentication

Authentication is handled using Supabase Auth.

Each authenticated user has:

user_id (UUID)

This user_id links all system resources.


Used for:

• Gmail OAuth tokens  
• label storage  
• processed emails  
• workflow events


---

# Gmail OAuth Architecture

Flow:

1. User clicks **Connect Gmail**

2. Frontend calls

GET /api/gmail/connect

3. Backend redirects to Google OAuth.

Scopes used:

https://www.googleapis.com/auth/gmail.readonly  
openid  
email  
profile

4. Google redirects back to backend

GET /api/gmail/callback

Parameters:

code  
state

5. Backend exchanges code for tokens:

access_token  
refresh_token  
expires_in

6. Tokens are encrypted using:

ENCRYPTION_KEY

7. Tokens are stored in Supabase.


---

# Supabase Tables

## users

Managed by Supabase Auth.

Fields:

id (UUID)  
email  
created_at


---

## gmail_tokens

Stores Gmail OAuth credentials.

Fields:

id  
user_id  
access_token  
refresh_token  
expires_at  
scope  
created_at  
updated_at

Tokens are encrypted before storage.


---

## labels

Stores Gmail labels synced for each user.

Fields:

id  
user_id  
gmail_label_id  
label_name  
created_at  
updated_at


---

## email_messages

Future processing table.

Fields:

id  
user_id  
gmail_message_id  
thread_id  
subject  
from_address  
snippet  
received_at  
created_at


---

## email_classifications

Stores AI classification results.

Fields:

id  
email_id  
classification  
confidence  
created_at


---

## workflow_events

Tracks automation events triggered by emails.

Fields:

id  
user_id  
email_id  
event_type  
event_status  
created_at


---

# Supabase Row Level Security

Row Level Security ensures each user only accesses their own data.

Typical policy example:

user_id = auth.uid()

Applied to tables:

• gmail_tokens  
• labels  
• email_messages  
• workflow_events


---

# Backend API Endpoints


## User Profile

GET /api/user

Returns authenticated user information.


---

## Gmail OAuth

Start OAuth connection

GET /api/gmail/connect


OAuth callback

GET /api/gmail/callback


Refresh access token

POST /api/gmail/refresh


Disconnect Gmail

DELETE /api/gmail/disconnect


---

# Gmail Email Retrieval

Fetch inbox messages

GET /api/gmail/messages


Fetch specific email

GET /api/gmail/messages/:id


Move email to label

POST /api/gmail/move

Body:

message_id  
label_id


---

# Labels API

Get labels

GET /api/labels


Sync Gmail labels

POST /api/labels/sync


Create label

POST /api/labels


Delete label

DELETE /api/labels/:id


---

# Gmail API Calls

Common endpoints used by XProFlow:

Get messages

https://gmail.googleapis.com/gmail/v1/users/me/messages


Get message details

https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}


Modify labels

https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}/modify


Get labels

https://gmail.googleapis.com/gmail/v1/users/me/labels


---

# Multi-Tenant Token Handling

Every Gmail request must use the token belonging to the correct user.

Example flow:

1. Identify user_id

2. Query Supabase:

SELECT * FROM gmail_tokens  
WHERE user_id = ?

3. Retrieve access_token

4. Call Gmail API:

Authorization: Bearer ACCESS_TOKEN


---

# n8n Workflow Pattern

Typical automation pipeline:

Webhook trigger  
↓  
Retrieve user token  
↓  
Fetch Gmail messages  
↓  
Send to AI classification  
↓  
Determine routing  
↓  
Move email to label or trigger workflow


---

# n8n Token Injection Pattern

When processing messages, the Gmail token must be attached to each message.

Example Code Node:

const token = $node["HTTP Request1"].json.access_token;

const messages = $json.messages.map(message => {
  return {
    ...message,
    access_token: token
  };
});

return [
  {
    json: {
      messages
    }
  }
];


---

# Docker Infrastructure

EC2 server runs these containers:

xproflow-api  
Node backend API

n8n  
workflow engine

nginx  
reverse proxy


---

# Server Directory

Main project directory:

/opt/xproflow


---

# EC2 Operational Commands

Switch to EC2 user

sudo su - ec2-user

Navigate to project

cd /opt/xproflow


---

# Debugging Commands

View API logs

docker logs xproflow-api -f


View n8n logs

docker logs n8n -f


View running containers

docker ps


Restart containers

docker compose restart


Pull latest code

git pull origin main


---

# Environment Variables

Stored in AWS Secrets Manager.

Examples:

SUPABASE_URL  
SUPABASE_SERVICE_ROLE_KEY  
GOOGLE_CLIENT_ID  
GOOGLE_CLIENT_SECRET  
INTERNAL_API_KEY  
ENCRYPTION_KEY


---

# Core Processing Pipeline

Email received  
↓  
Token authenticated Gmail API  
↓  
Email ingestion  
↓  
AI classification  
↓  
Workflow routing  
↓  
Label or automation execution


---

# Current Development Status

OAuth flow: partially working  
Token storage: working  
Label sync: implemented  
Frontend label retrieval: debugging  
Email ingestion: partial  
AI classification: planned  
Workflow automation: in development


---

# AI Development Instructions

When assisting with development always assume:

• multi-tenant SaaS architecture  
• Supabase authentication  
• Gmail OAuth token storage  
• encrypted credentials  
• n8n workflow orchestration  
• AWS Docker infrastructure  

All queries and workflows must respect user_id isolation.
