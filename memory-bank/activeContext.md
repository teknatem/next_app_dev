# Active Context

> **Purpose:** This document is a "live" workbench for the current task only. It should be cleared and updated at the start of each new task. Its goal is to provide immediate, focused context for the developer or AI working on the task.

---

## 🎯 Current Task: Refactor catalog-bots-d001 to proper Server Actions usage and domain rules

**Goal:** Enforce server/client separation, introduce server wrappers for UI, move enums to `model/enums.ts`, and rename orchestration file to `crud.server.ts`.

**Status:** In Progress → Next: propagate as reference in memory-bank

---

### 📝 Plan & Next Steps

1. Remove server action exports from `domains/catalog-bots-d001/index.ts` and keep them only in `index.server.ts`.
2. Rename `infra/crud.actions.server.ts` to `infra/crud.server.ts` and update imports.
3. Create server wrappers: `ui/bot.list.server.tsx`, `ui/bot.details.server.tsx`, `ui/bot.picker.server.tsx` that call server actions and pass data/actions to client.
4. Update client components to accept `initialData` and server action props instead of importing server code.
5. Move enums to `domains/catalog-bots-d001/model/enums.ts` and import them in `types.shared.ts`.
6. Update `README.md` to document the new pattern (prefer Server Actions over REST, usage examples).
7. Follow-up: add audit fields population and optimistic concurrency control (OCC) in repo/actions.

---

### 📂 Key Files & Components

- `domains/catalog-bots-d001/index.ts` — client-safe exports, no server actions
- `domains/catalog-bots-d001/index.server.ts` — server-only exports for actions
- `domains/catalog-bots-d001/infra/crud.server.ts` — orchestrator server actions
- `domains/catalog-bots-d001/ui/bot.list.server.tsx` — server wrapper for list
- `domains/catalog-bots-d001/ui/bot.details.server.tsx` — server wrapper for details
- `domains/catalog-bots-d001/ui/bot.picker.server.tsx` — server wrapper for picker
- `domains/catalog-bots-d001/ui/*.client.tsx` — updated to receive props for actions/loading
- `domains/catalog-bots-d001/model/enums.ts` — centralized enums

---

### 🤔 Open Questions & Blockers

- Do we have a standard helper to get `userId` in server actions? Likely via `getServerSession(authOptions)` from `shared/lib/auth.server.ts`, needs to be applied in audit fields phase.
- OCC strategy: confirm whether version check in WHERE clause is the chosen pattern across domains before implementing here.
