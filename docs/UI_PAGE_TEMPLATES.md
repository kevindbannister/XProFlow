# UI Page Templates

## Standard App Page Template
**Structure**
- `PageHeader`
- Content container `div` with `max-w-[1200px] mx-auto p-6`
- Use `grid` with `gap-6` for sections

**Skeleton**
- Header
- Primary content grid (2–3 columns on desktop)
- Secondary content stacked below

## Dashboard Template (KPIs + Charts + Activity)
- `PageHeader`
- KPI row: 3–4 cards in a `grid grid-cols-1 md:grid-cols-3 gap-6`
- Chart row: 2 columns (`md:grid-cols-2`) with chart cards
- Activity feed: full-width card below

## Settings Page Template
- `PageHeader` with actions (Save/Cancel)
- Left column: sections list (or tabs)
- Right column: form cards with `gap-6`

## Empty/Placeholder Page Template
- `PageHeader`
- Single centered `Card` with:
  - Title: “Coming soon”
  - Short description
  - Optional action button
