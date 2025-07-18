# System Patterns

## 🏛️ Architecture Overview

### FSDDD — Feature-Sliced Design + Domain-Driven Design

Our codebase follows **FSDDD**: a modified Feature-Sliced Design that incorporates key principles of Domain-Driven Design.

- **Domains as bounded contexts.** Each directory in `domains/` encapsulates its own model, data layer, services and UI.
- **Explicit ownership & rules.** Every domain has clear server/client boundaries, naming conventions and double-export barrels (see `cursor-domain-rules.md`).
- **Alignment with ubiquitous language.** Directory names and code terms mirror business terminology, reducing translation overhead.

# Feature‑Sliced Design with Next.js App Router

## Base Directory Layout

```text
project/
├─ shared/                       # tech‑agnostic atoms, utils, UI primitives
├─ domains/
│   └─ <domain>/                 # vertical slice of a business entity
│       ├─ model/                # ✅ SHARED - types, enums, zod schemas
│       │   └─ *.schema.ts       # Zod schemas + TypeScript types
│       ├─ data/                 # ⚠️ SERVER-ONLY - DB operations
│       │   └─ *.repo.server.ts  # Repository with 'server-only'
│       ├─ api/                  # ✅ CLIENT-ONLY - HTTP API calls
│       │   └─ *.api.client.ts   # Client API with 'use client'
│       ├─ lib/                  # 🔄 MIXED - utilities and services
│       │   ├─ *.shared.ts       # ✅ SHARED - pure functions
│       │   ├─ *.server.ts       # ⚠️ SERVER-ONLY - S3, external APIs
│       │   └─ *.client.ts       # ✅ CLIENT-ONLY - browser logic
│       ├─ ui/                   # ✅ CLIENT-ONLY - React components
│       │   └─ *.tsx             # All UI with 'use client'
│       ├─ index.ts              # ✅ CLIENT-SAFE - public API
│       ├─ index.server.ts       # ⚠️ SERVER-ONLY - server API
│       └─ README.md             # Documentation
├─ features/                     # cross‑/multi‑domain mechanisms
├─ widgets/                      # large UI sections composed from features
├─ entities/                     # small reusable business objects
└─ app/                          # Next.js routes (outside FSD structure)
```

> **Note:** This project uses explicit server/client separation with Next.js App Router. All domains follow the double export system (index.ts + index.server.ts).

---

## 1 . Server/Client Separation Rules

```text
CLIENT:  ui → api (client) → HTTP → API routes
SERVER:  API routes → data (server) → database
SHARED:  model, lib/shared → both environments
```

**Mandatory directives:**

- `'use client'` in \*.client.ts files
- `'server-only'` in \*.server.ts files

---

## 2 . Accessing a domain from outside

### **Client Context (React components)**

- Import **only** from `domains/<domain>/index.ts`
- Contains: UI components, client API, shared types

### **Server Context (API routes)**

- Import **only** from `domains/<domain>/index.server.ts`
- Contains: repositories, server services, shared types

### **Forbidden**

- Direct imports from internal modules
- Server code imports in client components

---

## 3 . Double Export System

| File              | Purpose                | Contains                                    |
| ----------------- | ---------------------- | ------------------------------------------- |
| `index.ts`        | ✅ Client-safe exports | UI, client API, shared types                |
| `index.server.ts` | ⚠️ Server-only exports | Repositories, server services, shared types |

---

## 4 . File Naming Convention

| Pattern       | Environment  | Directive       | Purpose                   |
| ------------- | ------------ | --------------- | ------------------------- |
| `*.server.ts` | Node.js only | `'server-only'` | DB, S3, external APIs     |
| `*.client.ts` | Browser only | `'use client'`  | HTTP calls, browser logic |
| `*.shared.ts` | Both         | None            | Pure functions, types     |
| `*.ts`        | Both         | None            | Default shared            |
| `*.tsx`       | Browser only | `'use client'`  | React components          |

---

## 5 . Root-level `features/`

- Orchestrate several domains.
- May import any domain barrels and `shared/*`.
- Must **not** import from root-level `widgets/` or reach inside a domain.

---

## 6 . Root-level `widgets/`

- Compose UI from `features/` and/or domain `widgets/`.
- Do **not** import other root-level `widgets/`.
- Never access `data/` directly.

---

## 7 . `data/` restrictions

- Used **only** within its own domain – from API routes or server‑side components.
- Client code and external layers cannot import it (lint‑checked).
- Must have `.server.ts` suffix and `'server-only'` directive.

---

## 8 . Root‑level `entities/` (edge case)

- Allowed only for very small reusable objects when spinning up a full domain is overkill.
- Follows the same rules: one public barrel, no upward imports.

---

## 9 . `app/` layer (pages & layouts)

- The folder `app/` is **reserved solely** for Next.js routing, basic layouts and high-level providers.
- Pages, layouts and templates must stay **thin**: minimal data-fetching, no business logic, no complex UI.
- Delegate heavy logic, state management and complex UI to **domains**, **features** and **widgets**.
- Allowed operations:
  1. Import server actions / domain server barrels to fetch data.
  2. Compose ready-made widgets or UI components.
  3. Configure metadata, `generateStaticParams`, etc.
- Forbidden:
  - Direct database access or S3 calls.
  - Large forms, tables, multi-step flows – move those into a widget.
  - Re-implementing logic already present in a domain.

---

## 10 . Import Path Depth Rule

**Different rules for different layers:**

### **Domains, Widgets, Entities** (Business Logic)

**Never import deeper than two sub-segments after the alias.**  
Allowed pattern: `@/<alias>/<segment>/<module>` (⩽ 3 total path parts including the alias).  
Examples:

- ✅ `@/widgets/llm-chat` _(barrel export)_
- ❌ `@/widgets/llm-chat/lib/chat-store`

### **Shared** (Technical Infrastructure)

**No depth restrictions for shared utilities.**  
Shared is technical infrastructure where any import depth is acceptable.  
Examples:

- ✅ `@/shared/ui/button`
- ✅ `@/shared/database/connection`
- ✅ `@/shared/database/connection/config`

### **Rationale**

- **Business layers** need strict boundaries to maintain domain isolation
- **Shared layer** is technical infrastructure where any import depth is acceptable for utility access
- **Barrel files** are still preferred when they provide clear value

Lint-check: ESLint rules enforce different depth limits for different aliases.

---

## 11 . Database Migrations Location

- Store **all** database migration files exclusively in `shared/database/migrations/`.
- Do **not** place migration scripts inside `domains/` or any other layer. Keeping them centralised avoids duplication and maintains clear history.
- **Naming convention:** Follow Drizzle/default incremental naming (e.g., `0006_add_is_deleted_to_employees.sql`).

---

## 12 . Правило: Использование Zustand

Принцип: Используй Zustand исключительно для клиентского состояния UI и временного состояния сессии в клиентских компонентах.
✅ Когда использовать:
Для управления интерактивностью UI: видимость модальных окон, состояние табов, локальные настройки пользователя в текущей сессии.
Для состояния, которое не является основным источником истины с сервера (например, данные формы до сохранения, временные индикаторы загрузки).
Для избежания "prop-drilling" между клиентскими компонентами.
📁 Размещение:
widgets/<widget-name>/lib/: Для состояния, специфичного для конкретного виджета (например, chat-store.ts для LLM-чата).
domains/<domain-name>/lib/: Для клиентского UI-состояния, тесно связанного с UI конкретного домена.
shared/store/: Для действительно глобального, клиентского UI-состояния (например, тема приложения, общие уведомления).
❌ Когда НЕ использовать:
Как основной источник истины для данных, хранящихся в базе данных (используй Server Components, Server Actions и Drizzle ORM для этого).
Для сложного кэширования серверных данных, дедупликации запросов или фонового обновления (предпочтительнее специализированные библиотеки типа React Query / SWR).
💡 Важно: Всегда используй Zustand-сторы и хуки только в файлах с директивой 'use client'. Server Components не имеют доступа к Zustand.

---

> **Follow these rules to keep every domain fully owning its data and UI while maintaining explicit server/client boundaries.**

---

### Дополнительные паттерны

Полные примеры и практические детали вынесены в отдельные файлы `memory-bank/*patterns.md`, чтобы не перегружать стратегический документ:

- **cursor-domain-rules.md** — Cursor Domain Rules (NEW)
- **domain-client-data-patterns.md** — Паттерн работы с данными доменов на клиенте
- llmIntegrationPatterns.md — LLM Integration Patterns
- databaseDesignPatterns.md — Database Design Patterns
- apiDesignPatterns.md — API Design Patterns
- performancePatterns.md — Performance Patterns
- codeQualityPrinciples.md — Code Quality Principles
- automatedProcedures.md — Automated Procedures
- [domain-registry.ts](./domain-registry.ts) — Domain Registry (центральный список бизнес-доменов)

## 📚 Reference Implementation

See `domains/catalog-files-d002/` for a complete example of the new domain structure with explicit server/client separation.

## ❗️Scope

> This document gives a **project-wide architectural overview**.  
> **Detailed, authoritative rules for Domain structure, naming, double-export barrels, server/client file suffixes, etc. live in [`memory-bank/cursor-domain-rules.md`](./cursor-domain-rules.md).**  
> If the two documents diverge, treat `cursor-domain-rules.md` as source of truth for Domain-level conventions.
> **Detailed, authoritative rules for DB structure, naming, etc. live in [`memory-bank/db rules.md`]**  
> Treat `memory-bank/db rules.md` as source of truth for DB structure.
