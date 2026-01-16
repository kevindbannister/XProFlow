# FlowMail AI (Vite + React + TypeScript)

A rebuilt interface for managing AI-powered email automations, scheduling, and integrations. The project now runs on a clean Vite + React + TypeScript stack with Tailwind CSS styling.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── public/
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── styles/
│   ├── views/
│   ├── index.css
│   └── main.tsx
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Available scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – type-check and create a production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run TypeScript for type-checking without emitting files.

## Cloudflare Pages deployment

This is a static Vite frontend, so Cloudflare Pages should build and deploy it directly without using Wrangler.

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Deploy command:** _none_ (Pages deploys automatically after the build)
- **Node version:** 18 LTS (see `.nvmrc`, `.node-version`, and `package.json` engines)

If your Pages project still tries to run `npx wrangler deploy`, remove that from the Pages build settings or any external CI job. Wrangler is only needed for Workers or Pages Functions, which this repo does not use.

## Notes

- API calls are stubbed in `src/services/api.ts` so you can wire them up to your backend or automation platform.
- Tailwind CSS powers the UI utility classes. Feel free to extend `tailwind.config.ts` or add custom styles under `src/styles/`.
