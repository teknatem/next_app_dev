# System Patterns

## 🏛️ Architecture Overview

# Feature‑Sliced Domain‑Driven Design (FSDDD) – Quick Rules

## Base Directory Layout

```text
src/
├─ shared/                       # tech‑agnostic atoms, utils, UI primitives
├─ domains/
│   └─ <domain>/                 # vertical slice of a business entity
│       model/                   # types, enums, zod schemas  ── entity
│       data/                    # DB / external IO (server‑only)
│       actions/                 # Next.js server actions
│       widgets/                 # React UI<br>
│       │   └─ …Widget.tsx       #   ➜ **Server Component** by default;<br>
│       │                         #     add `'use client'` on interactivity
│       hooks/                   # client‑side helpers
│       features/                # domain‑specific use‑cases
│       tests/                   # unit / e2e
│       index.ts                 # 🔑 single public barrel
├─ features/                     # cross‑/multi‑domain mechanisms
├─ widgets/                      # large UI sections composed from features
└─ app/                          # Next.js routes that render widgets
```

> **Note on `features` and `widgets` layers:** Both the root and domain levels have `features/` and `widgets/` folders. They are distinguished by their path and role. Root layers (`src/features/`, `src/widgets/`) orchestrate multiple domains, while domain layers (`src/domains/user/features/`) are specific to one domain.

---

## 1 . Dependency flow _inside_ a domain

```text
widgets (client) → widgets (server) → actions → data → model → shared
```

_Strictly downward; cycles are forbidden._

---

## 2 . Accessing a domain from outside

- Import **only** from `domains/&lt;domain&gt;/index.ts`.
- External code may call domain **actions** or render domain **widgets**, but **never** touches `data/`.

---

## 3 . Outward dependencies of a domain

| Allowed                         | Forbidden                                         |
| ------------------------------- | ------------------------------------------------- |
| `shared/*`, external libs       | imports from `app/`, `widgets/`, `features/`      |
| public barrels of other domains | direct imports of other domains’ internal folders |

---

## 4 . Root-level `features/`

- Orchestrate several domains.
- May import any domain barrels and `shared/*`.
- Must **not** import from root-level `widgets/` or reach inside a domain.

---

## 5 . Root-level `widgets/`

- Compose UI from `features/` and/or domain `widgets/`.
- Do **not** import other root-level `widgets/`.
- Never access `data/` directly.

---

## 6 . `data/` restrictions

- Used **only** within its own domain – from `actions/` or server‑side components.
- Client code and external layers cannot import it (lint‑checked).

---

## 7 . Root‑level `entities/` (edge case)

- Allowed only for very small reusable objects when spinning up a full domain is overkill.
- Follows the same rules: one public barrel, no upward imports.

---

> **Follow these rules to keep every domain fully owning its data and UI while maintaining a predictable, one‑way dependency graph.**

---

### Дополнительные паттерны

Полные примеры и практические детали вынесены в отдельные файлы `memory-bank/*Patterns.md`, чтобы не перегружать стратегический документ:

- llmIntegrationPatterns.md — LLM Integration Patterns
- databaseDesignPatterns.md — Database Design Patterns
- apiDesignPatterns.md — API Design Patterns
- performancePatterns.md — Performance Patterns
- codeQualityPrinciples.md — Code Quality Principles
- automatedProcedures.md — Automated Procedures
