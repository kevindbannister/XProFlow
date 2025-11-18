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

## Notes

- API calls are stubbed in `src/services/api.ts` so you can wire them up to your backend or automation platform.
- Tailwind CSS powers the UI utility classes. Feel free to extend `tailwind.config.ts` or add custom styles under `src/styles/`.
