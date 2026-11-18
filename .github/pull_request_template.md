## What & why

<!-- What does this change, and why? Link the issue: "Closes #123". -->

## How I verified it

<!-- Tests added/updated? For anything visual (preview, timeline, export), describe the browser check and add a screenshot or GIF. -->

## Checklist

- [ ] `pnpm format && pnpm typecheck && pnpm test && pnpm lint && pnpm build` all pass
- [ ] Engine logic has Vitest coverage
- [ ] No React/DOM imports in engine packages
- [ ] Document mutations go through `commit` (undoable)
