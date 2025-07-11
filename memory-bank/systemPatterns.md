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
│       data-access/             # DB / external IO (server‑only)
│       actions/                 # Next.js server actions
│       ui/                      # React UI<br>
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

---

## 1 . Dependency flow _inside_ a domain

```text
ui (client) → ui (server) → actions → data-access → model → shared
```

_Strictly downward; cycles are forbidden._

---

## 2 . Accessing a domain from outside

- Import **only** from `domains/&lt;domain&gt;/index.ts`.
- External code may call domain **actions** or render domain **widgets**, but **never** touches `data-access/`.

---

## 3 . Outward dependencies of a domain

| Allowed                         | Forbidden                                               |
| ------------------------------- | ------------------------------------------------------- |
| `shared/*`, external libs       | imports from `app/`, `widgets/`, root‑level `features/` |
| public barrels of other domains | direct imports of other domains’ internal folders       |

---

## 4 . Root‑level `features/`

- Orchestrate several domains.
- May import any domain barrels and `shared/*`.
- Must **not** import `widgets/` or reach inside a domain.

---

## 5 . Root‑level `widgets/`

- Compose UI from features and/or domain widgets.
- Do **not** import other widgets.
- Never access `data‑access/` directly.

---

## 6 . `data‑access/` restrictions

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
