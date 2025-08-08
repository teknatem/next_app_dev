# System Patterns

## 🏛️ Architecture Overview: Context-Driven Design (CDD)

Our codebase follows **Context-Driven Design (CDD)**, an architecture that prioritizes context localization and clarity for both developers and AI assistants. CDD is inspired by Domain-Driven Design (DDD) but adapted for our project's needs, focusing on tactical design and clear boundaries.

### Core Principles

- **Domains as Bounded Contexts:** Each directory in `domains/` encapsulates a vertical slice of business functionality, including its own model, data layer, services, and UI.
- **Explicit Context Boundaries:** Every domain has strict server/client separation, enforced by file naming conventions (`.server.ts`, `.client.ts`) and a double-barrel export system (`index.ts`, `index.server.ts`).
- **Context Alignment with Business Language:** Directory and file names mirror business terminology to reduce cognitive overhead.

### High-Level Structure

```text
project/
├─ app/                          # Next.js routing, layouts, pages (thin layer)
├─ domains/                      # Core business logic, one folder per domain
├─ widgets/                      # Complex UI components, composed of domain elements
├─ features/                     # Cross-domain logic and server actions
├─ shared/                       # Project-wide utilities, UI primitives, DB connection
└─ memory-bank/                  # Project documentation and rules
```

---

## 📚 Authoritative Rulebooks

This document provides a high-level architectural overview. **Detailed, authoritative rules** for implementation are located in dedicated files to ensure a single source of truth.

### 1. **Domain & Code Structure Rules**

For all rules regarding domain structure, file naming, server/client separation, import paths, and the double export system.

> **Source of Truth:** [`./cursor-domain-rules.md`](./cursor-domain-rules.md)

### 2. **Database Rules**

For all conventions related to database schema design, table naming, migrations, and ORM usage.

> **Source of Truth:** [`./db rules.md`](./db%20rules.md)

### 3. **Specific Implementation Patterns**

For detailed guides on implementing specific patterns like API design, LLM integration, and performance optimizations.

- [API Design Patterns](./patterns/api-design-patterns.md)
- [LLM Integration Patterns](./patterns/llm-integration-patterns.md)
- [Performance Patterns](./patterns/performance-patterns.md)

---

## 🔒 Server Actions Policy (Project-wide)

For the exact conventions and migration notes, see the authoritative rulebook:

- Location: `domains/<domain>/infra/`
- Naming: `*.actions.ts`
- Directive: first line must be `'use server'`
- Exports: only via `index.server.ts`; never via `index.ts`

> Details: [`./cursor-domain-rules.md`](./cursor-domain-rules.md)

---

## 🌟 Reference Implementations

- `domains/catalog-bots-d001/` — Reference for Server Actions with server wrappers (RSC passing actions/data), enums in `model/`, client-safe schemas, double index exports.
- `domains/catalog-files-d002/` — Reference for storage/S3 integration and file widgets.
