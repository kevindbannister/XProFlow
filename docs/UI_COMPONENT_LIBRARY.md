# UI Component Library

## Standard Components (Reusable)
Each component should be presentational unless explicitly noted.

### AppShellLayout
**Responsibility:** wraps Sidebar + TopBar + content container.
**Props:**
- `children: React.ReactNode`
- `sidebarCollapsed?: boolean`

### Sidebar
**Responsibility:** app navigation, expanded/collapsed modes, tooltips in collapsed mode.
**Props:**
- `collapsed: boolean`
- `items: NavItem[]`
- `onToggle: () => void`

### TopBar
**Responsibility:** search, notifications, theme toggle, profile.
**Props:**
- `onSearch?: () => void`
- `onToggleTheme?: () => void`
- `userName?: string`

### PageHeader
**Responsibility:** page title + optional actions/breadcrumbs.
**Props:**
- `title: string`
- `subtitle?: string`
- `actions?: React.ReactNode`

### Card
**Responsibility:** consistent surface container.
**Props:**
- `title?: string`
- `actions?: React.ReactNode`
- `children: React.ReactNode`

### Button
**Responsibility:** primary, secondary, ghost actions.
**Props:**
- `variant: 'primary' | 'secondary' | 'ghost'`
- `size?: 'sm' | 'md' | 'lg'`
- `icon?: React.ReactNode`
- `children: React.ReactNode`

### StatChip
**Responsibility:** compact KPI or filter chip.
**Props:**
- `label: string`
- `value?: string`

### ActivityFeed
**Responsibility:** vertical list of activity items.
**Props:**
- `items: { id: string; title: string; meta?: string }[]`

### Tooltip
**Responsibility:** hover label for icon-only elements.
**Props:**
- `content: string`
- `children: React.ReactNode`

## Naming Conventions
- **Components:** PascalCase
- **Files:** `PascalCase.tsx`
- **Folders:**
  - `src/components/layout/`
  - `src/components/ui/`
  - `src/components/dashboard/`

## Component Rules
- Create components only when **reused 2+ times**.
- Keep components **dumb/presentational** unless otherwise specified.
