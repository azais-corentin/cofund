# Agent Guidelines for Cofund

**Stack**: SvelteKit (Svelte 5 runes), TypeScript (strict), Tailwind v4, Jazz (real-time sync), Zod, Bun

## Commands

```bash
bun dev                # Dev server
bun build              # Production build
bun run format         # Format with dprint
bun run lint           # Lint with oxlint (type-aware)
bun run check          # Type-check with svelte-check
```

## Code Style

### Formatting

- **dprint**: 2 spaces, 100 line width, single quotes, format on save

### TypeScript

- **Imports**: Framework → Components ($lib) → Schemas → Third-party → Types
- **Aliases**: Use `$lib`, `$app`, `$env` (add `.js` for relative imports in `$lib`)
- **Types**: Strict mode, derive from Zod: `type Group = z.infer<typeof GroupSchema>`
- **Naming**: Files=kebab-case, Components=PascalCase, vars/funcs=camelCase, Types=PascalCase

## Architecture

```
src/
├── lib/
│   ├── components/      # ui/ (shadcn) + app components
│   ├── db/schema.ts     # Jazz schemas (Account, Profile, Group, Operation)
│   ├── schemas/         # Zod validation (common.ts, group.ts, operation.ts)
│   └── utils.ts
├── routes/
│   ├── (app)/          # Auth-required routes
│   └── (demo)/         # Demo routes
└── hooks.server.ts     # Server hooks
```

## Svelte MCP Tools

Use the Svelte MCP server for comprehensive Svelte 5 and SvelteKit docs. Follow this order:

- `list-sections`: Use first to discover all sections. For any Svelte/SvelteKit question, always call this at the start to find relevant sections.
- `get-documentation`: After `list-sections`, review `use_cases` and fetch all relevant sections (single or multiple).
- `svelte-autofixer`: Run on any Svelte code you write before sharing; iterate until no issues or suggestions remain.
- `playground-link`: After code is complete, ask if the user wants a Playground link; only call after they confirm, and never if code was written to files in this repo.

## Context7 MCP Tools

Use Context7 MCP to fetch third-party library docs:

- `resolve-library-id`: Resolve a general library name to a Context7-compatible library ID. Param: `libraryName` (required).
- `get-library-docs`: Fetch docs with an exact Context7-compatible ID (e.g., `/mongodb/docs`, `/vercel/next.js`). Optional: `topic` to focus results; `tokens` (default 5000; values <1000 are raised to 1000).
- Flow: call `resolve-library-id` first (unless the user provides an exact ID), then `get-library-docs`.
