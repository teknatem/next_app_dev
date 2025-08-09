# Active Context

> **Purpose:** This document is a "live" workbench for the current task only. It should be cleared and updated at the start of each new task. Its goal is to provide immediate, focused context for the developer or AI working on the task.

---

## 🎯 Current Task: Обновить правила структуры каталога `ui/` — «один виджет — одна папка»

**Goal:** Зафиксировать в Memory Bank новую структуру `ui`: каждый виджет в собственной папке с локальным баррелем `index.ts`. Обновить ссылки на эталон `domains/catalog-files-d002/ui` и правила ре-экспорта через домен.

**Status:** COMPLETE — документы обновлены (`cursor-domain-rules.md`, `systemPatterns.md`).

---

### 📝 Plan & Next Steps

1. Прописать правило в `cursor-domain-rules.md` с примером структуры и экспорта — DONE.
2. Добавить ссылку в `systemPatterns.md` на референс домена — DONE.
3. Провести миграцию в доменах, где виджеты пока лежат плоско — TODO (по мере приоритета).

---

### 📂 Key Files & Components

- `domains/catalog-files-d002/ui/` — эталонная структура: папка на виджет + локальные `index.ts` + баррель `ui/index.ts` + реэкспорт через `domains/<domain>/index.ts`.

---

### 🤔 Open Questions & Blockers

- Требуется ли ввод серверных обёрток `*.server.tsx` для каждого виджета по умолчанию? Пока — по необходимости, правило не обязывает.
