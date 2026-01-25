# Flowiee UI Spec (v2)

## Purpose
Flowiee is an AI-assisted email triage workspace built for accounting teams. The UI prioritizes client requests, surfaces status signals, and keeps accountants focused on resolving inbound work quickly.

## Initial Pages
- **Dashboard / Public Home**: High-level KPIs and quick actions for the firm.
- **Inbox**: Primary triage workspace with thread list + detail panel.
- **Settings**: Team preferences, inbox rules, and integrations.

## Layout Expectations
- App layout uses a **persistent sidebar** and a **topbar** for context and actions.
- Content should be presented in a two-column layout where appropriate (list + detail).

## UI States
Every feature must include:
- Loading state
- Empty state
- Error state

## Data Strategy
- Use **mock data** until backend integration is ready.
- Keep mock data centralized in `/src/lib/constants.ts`.

## Component Standards
- Avoid duplicated UI or logic.
- Build reusable components in `/src/components` and reuse them across pages.
