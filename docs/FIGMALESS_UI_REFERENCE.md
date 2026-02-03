# Figmaless UI Reference (Flow-style)

## UI Description (Bullet Rules)
- Minimal SaaS dashboard with a Notion + Linear vibe.
- Left sidebar, topbar, and centered content container.
- Neutral palette, subtle borders, light shadows, and generous whitespace.
- Cards are the primary surface; all content lives inside cards.
- Icons are line-based, small, and consistent.

## Tailwind-ish Token Examples
- Layout: `min-h-screen bg-slate-50`, `max-w-[1200px] mx-auto p-6`.
- Card: `rounded-lg border border-slate-200/70 bg-white p-4 shadow-sm`.
- Header: `text-2xl font-semibold`.
- Subtext: `text-xs text-slate-500`.
- Buttons: `rounded-lg px-4 py-2 text-sm`.

## Golden Reference: Dashboard Spec
**Header**
- Title: “Welcome back, Kev”
- Optional subtitle: “Here’s your week at a glance.”

**Stat Chips**
- Chips in a row: **“1 week”**, **“167 words”**, **“89 WPM”**
- Style: `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium bg-slate-50`.

**Hero Onboarding Card**
- Pale-yellow highlight card (`bg-amber-50`)
- Content: onboarding copy + primary CTA
- Rounded-xl, subtle border, no heavy shadow

**Activity Feed**
- Card titled “Activity”
- Vertical list of items with timestamp subtext
