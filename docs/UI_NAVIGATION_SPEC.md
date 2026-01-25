# UI Navigation Spec

## Sidebar Navigation Items
- Dashboard → `/`
- Email Setup → `/email-setup`
- Settings → `/settings`

## Active Route Highlighting
- Active item: `bg-slate-100 text-slate-900 font-medium` (dark: `bg-slate-800`).
- Inactive item: `text-slate-600 hover:text-slate-900 hover:bg-slate-50`.

## Collapsed Rail Behavior
- Collapsed width: **72px**.
- **Tooltips required** on icon-only nav items.
- Sidebar toggle button in TopBar or Sidebar footer.
- Persist state with `localStorage` key: **`xproflow.sidebar.collapsed`**.

## Mobile Behavior (if supported)
- Sidebar overlays content and can be dismissed.
- Default to hidden on small screens.
