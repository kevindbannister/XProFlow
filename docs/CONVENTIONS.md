# Flowiee Frontend Conventions

## Naming
- **Files**: `PascalCase` for components, `camelCase` for utilities.
- **Components**: `PascalCase` and default export per file.

## Folder Rules
- Feature-first structure under `/src`.
- Shared UI in `/src/components/ui`.
- Layout in `/src/components/layout`.
- Inbox-specific components in `/src/components/inbox`.

## Types
- Store domain types in `/src/types`.
- No inline type definitions inside components except for simple props.

## API Calls
- Centralize HTTP helpers in `/src/lib/api.ts`.
- Keep API calls pure and return typed data.

## Tailwind Formatting
- Use Tailwind utilities for layout and styling.
- Group classes by: layout → spacing → typography → color → effects.
- No inline style objects or random CSS overrides.

## Component Size
- Keep components small and focused.
- Prefer composition over large monolith components.
