# XProFlow / EmailAI Frontend – Working Agreement (Codex + Dev Rules)

This repository is the frontend for XProFlow (formerly Flowiee).
Codex MUST follow this agreement to ensure fast, consistent development.

---

## 0) Primary Objective
Build a premium, futuristic SaaS UI that matches the approved design system:
- left sidebar navigation
- top bar controls
- Dashboard KPIs + Email Makeup chart
- Email Setup flow (Gmail + Office 365 auth UI)
- Settings page

Core priorities:
1) SPEED of iteration
2) CONSISTENCY of patterns
3) MINIMAL code changes per task

---

## 1) Tech Stack (Locked)
This repo uses:
- Vite
- React
- TypeScript
- TailwindCSS
- ESLint

Do NOT introduce:
- Next.js
- Redux (unless explicitly requested)
- styled-components, MUI, Chakra etc
- any CSS framework besides Tailwind

---

## 2) Repo Ground Truth (Don’t Fight It)
Repository structure includes:
- /src
- /public
- /docs
- eslint.config.js
- tailwind.config.ts
- vite.config.ts
- tsconfig*.json

Codex must adapt to this repo (not replace it).

---

## 3) Rules for Codex Changes (Most Important)
### ✅ Always
- Keep edits tightly scoped to the task.
- Keep diffs small.
- Prefer adding new files over editing many existing files.
- Follow existing formatting and lint rules.
- Use TypeScript types for props + data.

### ❌ Never
- Don’t refactor unrelated code.
- Don’t rename folders for “cleanliness”.
- Don’t swap routing libraries unless asked.
- Don’t install extra UI libraries without approval.
- Don’t rebuild the project structure.

---

## 4) Workflow: Scaffold → UI → Logic → Integrations
Codex must build in this order:
1) page scaffolding (routing, layout shell)
2) UI components (static first)
3) mock data wiring
4) API wiring
5) auth + database integration

Until asked otherwise:
- pages can use static/mock data
- no backend calls
- no auth enforcement

---

## 5) Required UI Pages
The app must include 3 main pages:
- Dashboard
- Email Setup
- Settings

These must appear in the sidebar.

Routes (preferred):
- /dashboard
- /email-setup
- /settings

Default redirect:
- / → /dashboard

---

## 6) Layout Requirements (Non-negotiable)
### Sidebar
- left aligned
- contains: Dashboard, Email Setup, Settings
- shows active state

### Top Bar
Must include:
- search icon/button
- notifications icon/button
- help icon/button
- dark-mode toggle
- profile avatar + user name

Top bar MUST NOT contain page menu items.

---

## 7) Dashboard Requirements
Dashboard MUST contain:

### KPI Cards
- Emails Processed
- Total Time Saved
- Cost Saved

### “Your Email Makeup”
Chart showing distribution:
- Awaiting Response
- FYI
- Marketing

### Additional KPIs
- % writing like you
- total sent emails

---

## 8) Folder Structure Standard (Inside /src)
Codex should create/use this structure where needed:

src/
  app/
    App.tsx
    routes.tsx
    layout/
      AppLayout.tsx
      Sidebar.tsx
      Topbar.tsx

  pages/
    Dashboard.tsx
    EmailSetup.tsx
    Settings.tsx

  components/
    layout/
    dashboard/
    email/
    common/

  data/
    mockDashboard.ts

  types/
    dashboard.ts
    user.ts

  lib/
    cn.ts
    utils.ts

---

## 9) Component Rules
- Pages are thin wrappers (layout + sections only)
- UI sections live in components/*
- No component should exceed ~200 lines without a reason
- Reusable UI blocks must be extracted (KPI card, chart card, etc)

Naming:
- PascalCase for components
- kebab-case for folders
- NO abbreviations unless obvious

---

## 10) Styling Rules
- Tailwind only
- Dark theme must work
- Use consistent spacing (gap-4 / gap-6, p-4 / p-6)
- cards: rounded-2xl, soft shadows
- “premium fintech AI” aesthetic

---

## 11) Performance Rules
- avoid unnecessary state
- avoid excessive rerenders
- keep logic out of layout components
- memoization only when needed

---

## 12) Codex Output Format
When implementing tasks, Codex must:
1) list files it will change
2) only output changed files
3) avoid long explanations

If >5 files are needed:
- Codex must justify why

---

## 13) Definition of Done
A task is done when:
- app builds successfully
- TypeScript passes
- lint passes (where configured)
- UI matches design spec at a basic level
- no unrelated files were edited
