# Agent Guidelines

## Build & Test Commands

- **Dev**: `bun run dev` (Vite dev server)
- **Build**: `bun run build`
- **Format**: `bun run format` (auto-fixes formatting)
- **Lint**: `bun run lint` (oxlint with type checking)
- **Type Check**: `bun run check` (svelte-check)

## Code Style & Conventions

**Imports**: Group and sort imports by type (external packages, internal paths like `$lib`, `.` relative). Use explicit named imports.

**Formatting**: 2-space indents, 100-char line width. Use single quotes in TypeScript/JavaScript (per dprint config). Format with `dprint fmt` before committing.

**TypeScript**: Strict mode enforced. Use explicit types for function parameters and returns. No `any` types.

**Naming**: camelCase for variables/functions, PascalCase for components/types. Use meaningful names (e.g., `deserializeGroup` not `parse`).

**Components**: Svelte files use `lang="ts"`, `$bindable()` for refs, `$props()` for reactive props. Use Tailwind + `cn()` utility (from `$lib/utils.js`) for styles. Props use `WithElementRef` helper.

**Error Handling**: Use try-catch with descriptive error messages. Log errors with `console.error()` and `console.info()` for key operations.

**Commit Messages**: Follow Conventional Commits: `type(scope): description` (e.g., `feat(db): add synchronization`, `fix(ui): button styling`).

## Key Tools & Libraries

- **Framework**: SvelteKit + Svelte 5
- **Styling**: Tailwind CSS v4 + tailwind-variants + shadcn-svelte
- **Database**: TinyBase (IndexedDB + WebSocket sync)
- **Forms**: sveltekit-superforms + TypeBox validation
- **Icons**: Lucide Svelte

## Documentation Lookup

Use context7 tools to fetch documentation:

- `context7_resolve_library_id`: First call to get library ID (e.g., `context7_resolve_library_id("SvelteKit")`)
- `context7_get_library_docs`: Then fetch docs with the resolved ID (e.g., `context7_get_library_docs("/sveltejs/kit")`)
- Optionally add `topic` parameter to focus on specific areas (e.g., `topic: "routing"`)
- Optionally add `tokens` parameter to control documentation length (default: 5000)
