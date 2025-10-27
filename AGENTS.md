# Agent Guidelines for cofund

## Documentation

- **jazz**: https://jazz.tools/llms-full.txt
- **shadcn-svelte**: https://www.shadcn-svelte.com/llms.txt
- **Use context7 for up to date documentation**

## Commands

- **Dev**: `bun vite dev` or `bun dev`
- **Build**: `bun vite build` or `bun build`
- **Lint**: `bun run lint` (uses oxlint with type-awareness)
- **Type check**: `bun run check` (runs svelte-kit sync + svelte-check)
- **Format**: `bun run format` or `dprint fmt`
- **No test runner configured**

## Code Style

- **Runtime**: Bun with TypeScript strict mode
- **Framework**: SvelteKit 2 with Svelte 5 (use runes: `$props`, `$bindable`, `$state`, etc.)
- **Formatting**: dprint - 2 spaces, line width 100, single quotes, no semicolons
- **Imports**: Use `.js` extensions (e.g., `from '$lib/utils.js'`), prefer named imports
- **Types**: TypeScript strict mode, use `type` keyword for type imports when possible
- **Schemas**: Use TypeBox for validation (see `src/lib/schemas.ts` for examples)
- **Components**: Svelte 5 style with `<script lang="ts" module>` for exports, `$props()` for props
- **Utilities**: Use `cn()` from `$lib/utils.js` for className merging
- **Logging**: Use `@logtape/logtape` with structured logging (see server code examples)
- **Commits**: Follow Conventional Commits (feat/fix/chore/docs/refactor/etc.)
- **NO COMMENTS**: Do not add code comments unless explicitly requested
