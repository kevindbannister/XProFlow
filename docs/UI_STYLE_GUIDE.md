# UI Style Guide (Single Source of Truth)

## Layout Rules
- App shell: **left sidebar + topbar + content container**.
- Sidebar width: **expanded 240px**, **collapsed 72px**.
- Topbar height: **64px**.
- Content max width: **1200px** (centered with `mx-auto`).
- Page padding: **24px** (`p-6`) with section gaps **24px** (`gap-6`).

## Typography Rules
- Base font: system or current app font.
- Body: **text-sm** (14px), **font-normal**.
- Subtext: **text-xs** (12px), **text-muted-foreground**.
- Heading hierarchy:
  - Page title: **text-2xl font-semibold**
  - Section title: **text-lg font-semibold**
  - Card title: **text-sm font-medium**

## Spacing System
- Use Tailwind scale: **2, 3, 4, 6, 8, 10, 12** (e.g., `p-4`, `gap-6`).
- Avoid arbitrary spacing values unless required by layout.

## Border Radius Tokens
- Default card/button radius: **rounded-lg**.
- Larger surfaces (hero cards): **rounded-xl**.

## Border & Shadow Rules
- Subtle borders: **border border-slate-200/70** (dark: **border-slate-800/60**).
- Minimal shadow: **shadow-sm** only on cards; avoid heavy shadows.

## Background Colors
- App background: **slate-50** (dark: **slate-950**).
- Sidebar background: **white** (dark: **slate-900**).
- Card background: **white** (dark: **slate-900**).
- Highlight/hero background: **amber-50** (dark: **amber-950/20**).

## Button Styles
- Primary: solid, high-contrast (`bg-slate-900 text-white`), **rounded-lg**, `px-4 py-2`.
- Secondary: outline (`border border-slate-200 text-slate-900`), **rounded-lg**.
- Ghost: transparent with subtle hover (`hover:bg-slate-100`).

## Stat Chip Style
- Compact pill with label + value.
- `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium`.
- Subtle background (`bg-slate-50`) and border (`border-slate-200/70`).

## Card Patterns
- Card container: `rounded-lg border bg-white p-4 shadow-sm`.
- Card header: title + optional action on right.
- Card body: content grid or list with `gap-3`.

## Tooltip Pattern
- Tooltip on icon-only buttons and collapsed sidebar items.
- `text-xs rounded-md bg-slate-900 text-white px-2 py-1 shadow-sm`.

## Icon Style Rules
- Use line icons, **1.5px stroke**, consistent size (16–20px).
- Icon buttons use `h-8 w-8` with `rounded-md`.

## Do’s and Don’ts
**Do**
- Use neutral palette with subtle accents.
- Keep visual noise low; prioritize whitespace.
- Use consistent spacing and typography tokens.

**Don’t**
- Don’t use loud colors or neon accents.
- Don’t add heavy shadows or gradients.
- Don’t mix inconsistent font sizes or radii.
