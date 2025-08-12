# Cursor Domain Rules - Next.js CDD Project

## 🎯 CRITICAL: Domain Structure Rules

### **Always follow these rules when working with domains in this project**

---

## ⭐️ NEW: Model Layer and Enums

Для обеспечения максимальной консистентности и строгого разделения ответственности, вводится папка `model/` на уровне каждого домена.

### **1. Расположение Enum'ов (`enums.shared.ts`)**

- **Правило:** Все перечисления (enums) и константы, используемые в домене, **ДОЛЖНЫ** определяться в файле `domain/<domain>/model/enums.shared.ts`.
- **Формат:** Рекомендуется использовать `as const` для создания строковых enum'ов и экспортировать как константу, так и тип.

  ```typescript
  // domain/<domain>/model/enums.shared.ts

  export const MEETING_ASSET_KINDS = ['document', 'audio', 'video'] as const;
  export type MeetingAssetKind = (typeof MEETING_ASSET_KINDS)[number];
  ```

- **Причина:** Централизация всех возможных состояний и типов в одном месте упрощает поддержку и снижает риск ошибок. Файл `enums.shared.ts` становится единственным источником правды для всех перечислений в домене и явно помечает их как пригодные для общего использования (client-safe).

### **2. Другие файлы в `model/`**

- Папка `model/` также может содержать другие файлы, описывающие основную модель данных домена, если это необходимо (например, сложные схемы валидации, которые не являются частью `types.shared.ts`).

---

## 📁 Domain Structure Template (Unified)

```
domain/
└── <dNNN>-<slug>/
    ├── infra/                 # ⚠️ SERVER-ONLY — инфраструктура домена
    │   ├── orm.server.ts           # Drizzle ORM (обязательно 'server-only')
    │   ├── *.repo.server.ts        # Репозитории и DB-адаптеры
    │   ├── *.service.server.ts     # Интеграции (S3, email, внешние API)
    │   └── *.actions.ts            # Server Actions ('use server' первой строкой)
    ├── model/                 # ✅ SHARED — клиент-безопасные модели
    │   ├── enums.shared.ts         # Перечисления (as const + типы)
    │   └── schemas.shared.ts       # Zod-схемы для сущностей/форм
    ├── ui/                    # 🔄 MIXED — UI (паттерн "1 виджет — 1 папка")
    │   ├── <entity>-list/
    │   │   ├── <entity>-list.client.tsx
    │   │   └── index.ts
    │   ├── <entity>-details/
    │   │   ├── <entity>-details.client.tsx
    │   │   └── index.ts
    │   ├── <entity>-picker/
    │   │   ├── <entity>-picker.client.tsx
    │   │   └── index.ts
    │   └── index.ts                # Баррель для всего UI домена
    ├── lib/                   # OPTIONAL — утилиты (см. правила ниже)
    │   ├── *.shared.ts             # Клиент-безопасные чистые функции
    │   ├── *.client.ts             # Браузерная логика (с 'use client')
    │   └── (без server-файлов)     # Серверные утилиты держим в infra/
    ├── types.shared.ts        # ✅ SHARED — типы на основе Zod + реэкспорт схем/enum'ов
    ├── index.ts               # ✅ CLIENT-SAFE — публичный API для клиента (без серверного кода)
    ├── index.server.ts        # ⚠️ SERVER-ONLY — публичный API для сервера
    └── README.md              # Документация домена
```

---

## 📦 Папка `lib/` (необязательная, только client-safe/shared)

### Назначение

- Небольшие чистые утилиты, форматирование, хелперы проверки, константы — всё, что безопасно для клиента и не требует Node/API-зависимостей.

### Правила

- Серверных файлов в `lib/` не держим. Любой код с внешними интеграциями, доступом к БД/файлам и т.п. — в `infra/`.
- Допустимы только `*.shared.ts` и `*.client.ts`. Для серверной логики используйте `infra/*.server.ts`.

### Примеры

```
lib/
├── date-utils.shared.ts       # Форматирование дат (pure)
├── validation.shared.ts       # Валидация схем/форм (pure)
└── dom.client.ts              # Узко-браузерные утилиты
```

---

## 🎯 Double Export System

### **Client Index (index.ts)**

```typescript
// ✅ CLIENT-SAFE exports only
export * from './model/files.schema'; // Shared types & schemas
export { toISOString } from './lib/date-utils'; // Shared utilities
export { fileApiClient } from './api/file.api.client'; // Client API
export { FileList } from './ui/file-list.client'; // UI components
export { FilePicker } from './ui/file-picker.client'; // Picker for client use
```

### **Server Index (index.server.ts)**

```typescript
import 'server-only';

// ⚠️ SERVER-ONLY exports
export * from './model/files.schema'; // Shared types & schemas
export { toISOString } from './lib/date-utils'; // Shared utilities
export { fileRepositoryServer } from './infra/file.repo.server'; // Server data
export { getPresignedUploadUrlServer } from './infra/s3.service.server'; // Server services
```

---

## 💎 UI Widget Conventions

### **1. Разделение на серверные и клиентские компоненты (Server/Client Component Separation):**

- Все UI-компоненты, расположенные в `domain/<domain>/ui/`, по умолчанию являются серверными компонентами и должны иметь суффикс `.server.tsx`.
- Компоненты, требующие клиентской интерактивности (хуки React, обработчики событий), должны быть в файлах с суффиксом `.client.tsx` и содержать директиву `'use client'`.

### **2. Обязательные виджеты для доменов типа `catalog` и `document` (Mandatory Widgets for `catalog` and `document` domains):**

Для обеспечения консистентности, каждый домен типа `catalog` или `document` должен предоставлять следующий набор обязательных UI-виджетов. Именование должно следовать шаблону `<entity>.<widget_type>.client.tsx`, где `<entity>` — это основная сущность домена (например, `employee`, `file`).

- **Виджет списка элементов (List Widget):**

  - **Назначение:** Отображение списка сущностей с возможностью фильтрации, поиска и пагинации.
  - **Именование:** `<entity>.list.client.tsx`
  - **Пример:** `employees.list.client.tsx`

- **Виджет детальной информации (Details Widget):**

  - **Назначение:** Отображение полной информации об одной сущности. Может включать режимы просмотра и редактирования. Для реализации форм редактирования используется паттерн "Полная Копия", описанный в [domain-client-data-patterns.md](./patterns/domain-client-data-patterns.md).
  - **Именование:** `<entity>.details.client.tsx`
  - **Пример:** `employees.details.client.tsx`

- **Виджет выбора элемента (Picker Widget):**
  - **Назначение:** Предоставление интерфейса для выбора одной или нескольких сущностей из списка. Используется для связывания сущностей между разными доменами.
  - **Именование:** `<entity>.picker.client.tsx`
  - **Экспорт:** Этот компонент **должен** экспортироваться из корневого `index.ts` домена, чтобы быть доступным для других доменов в клиентском коде.
  - **Пример:** `employees.picker.client.tsx`

---

### **3. Структура каталога `ui/`: "Один виджет — одна папка" (UPDATED)**

> Пример эталона: `domain/d002-files/ui`

Для масштабируемости и удобства навигации каждый виджет размещается в собственной папке внутри `ui/`. Каждый виджет имеет локальный `index.ts`-баррель и экспортируется на уровень домена через `ui/index.ts`, а затем — через корневой `index.ts` домена.

Структура:

```text
domain/<dNNN>-<slug>/
  ui/
    <entity>-list/
      <entity>-list.client.tsx
      index.ts
    <entity>-details/
      <entity>-details.client.tsx
      index.ts
    <entity>-picker/
      <entity>-picker.client.tsx
      index.ts
    index.ts            # Баррель для всех виджетов домена
```

Пример содержимого баррелей:

```ts
// domain/<dNNN>-<slug>/ui/<entity>-list/index.ts
export { EntityList } from './<entity>-list.client';

// domain/<dNNN>-<slug>/ui/index.ts
export { EntityList } from './<entity>-list';
export { EntityDetails } from './<entity>-details';
export { EntityPicker } from './<entity>-picker';
```

Экспорты на уровне домена (client-safe):

```ts
// domain/<dNNN>-<slug>/index.ts
export * from './ui';
// ...плюс любые shared-типы/схемы
```

Экспорты на уровне домена (server-only) — только серверные обёртки/действия:

```ts
// domain/<dNNN>-<slug>/index.server.ts
import 'server-only';
export * from './infra/crud.actions';
// export { EntityListServer } from './ui/<entity>-list.server'; // при наличии серверных обёрток
```

Обоснование:

- Чёткая группировка файлов виджета (код + локальный баррель + тесты в будущем).
- Упрощённые относительные пути и читабельные ре-экспорты.
- Плавное масштабирование при росте функциональности виджета.

---

## 🔥 MANDATORY File Naming Rules

### **Server Files (Node.js only)**

- **ALWAYS** use `.server.ts` suffix
- **ALWAYS** add `import 'server-only';` at the top
- **Examples:** `file.repo.server.ts`, `s3.service.server.ts`

> Exception: Server Actions use `*.actions.ts` and must begin with `'use server'` (see Server Actions Conventions below).

### **Client Files (Browser only)**

- **ALWAYS** use `.client.ts` suffix
- **ALWAYS** add `'use client';` at the top
- **Examples:** `file.api.client.ts`, `validation.client.ts`

### **Shared Files (Both environments)**

- **ALWAYS** use `.shared.ts` suffix OR no suffix
- **NEVER** add environment directives
- **Examples:** `date-utils.ts`, `types.shared.ts`

---

## 🚫 FORBIDDEN Patterns

### **❌ NEVER do this:**

```typescript
// ❌ Direct imports from internal modules
import { fileRepository } from '@/domain/files/data/file.repo.server';

// ❌ Exporting server code from client index
export { fileRepository } from './data/file.repo.server';

// ❌ Mixing server/client code in same file
export const clientFunction = () => {
  /* client code */
};
export const serverFunction = async () => {
  /* server code */
};

// ❌ Wrong file naming
data / file.repo.ts; // Should be .server.ts
api / file.api.ts; // Should be .client.ts
```

### **✅ ALWAYS do this:**

```typescript
// ✅ Import from index files
import { fileApiClient } from '@/domain/files';
import { fileRepositoryServer } from '@/domain/files/index.server';

// ✅ Clear separation
// Client file: api/file.api.client.ts
('use client');
export const fileApiClient = {
  /* client code */
};

// Server file: data/file.repo.server.ts
import 'server-only';
export const fileRepositoryServer = {
  /* server code */
};
```

---

## 📋 Usage Rules

### **In API Routes (Server Context)**

```typescript
// ✅ Use server index
import {
  fileRepositoryServer,
  insertFileSchema
} from '@/domain/files/index.server';
```

### **In React Components (Client Context)**

```typescript
// ✅ Use client index
import { fileApiClient, File } from '@/domain/files';
```

### **In Shared Utilities**

```typescript
// ✅ Import shared modules directly
import { toISOString } from '@/domain/files/lib/date-utils';
```

---

## 🏗️ Project Context

### **Technology Stack**

- **Next.js 15** with App Router
- **TypeScript** strict mode
- **Drizzle ORM** with PostgreSQL
- **Yandex Cloud S3** for object storage
- **Context-Driven Design** architecture

### **Key Principles**

1. **Server/Client Separation** - Explicit boundaries
2. **Minimal Index Files** - Two index files max per domain
3. **Type Safety** - Zod schemas + TypeScript
4. **Performance** - Tree-shaking friendly exports
5. **Scalability** - Context-driven design

---

## 🔄 Migration Path

### **When updating existing domains:**

1. **Identify server-only code** - DB operations, S3, external APIs
2. **Add .server.ts suffixes** - Rename files appropriately
3. **Add 'server-only' directives** - Top of server files
4. **Create client API layer** - \*.api.client.ts files
5. **Update index files** - Split exports between client/server
6. **Test isolation** - Verify no server code in client bundle

---

## 🎯 Quality Checklist

### **Before submitting domain changes:**

- [ ] All server files have `.server.ts` suffix + `'server-only'`
- [ ] All client files have `.client.ts` suffix + `'use client'`
- [ ] All Server Actions are under `infra/` with `*.actions.ts` suffix + first line `'use server'`
- [ ] Two index files: `index.ts` (client) + `index.server.ts` (server)
- [ ] No direct imports from internal modules
- [ ] Server code not exported from client index
- [ ] Client code not exported from server index
- [ ] README.md updated with structure explanation

---

## 💡 Remember

**"If you're not sure whether code is client or server, it's probably shared"**

**"Always prefer explicit naming over implicit assumptions"**

**"Two index files are better than one confused index file"**

---

## 📚 References

### **Эталонные реализации:**

- `domain/catalog-bots-d001/` — Server Actions + серверные обёртки (RSC → клиент), double index, `model/` с enums и схемами, клиент-безопасные экспорты.
- `domain/d002-files/` — Интеграция с хранилищем (S3) и файловые виджеты.
- [domain/d003-employees/README.md](../domain/d003-employees/README.md) — CRUD и оркестрация действий.

### **Дополнительные материалы:**

- [Context-Driven Design](https://feature-sliced.design/) — Official documentation
- [Next.js App Router](https://nextjs.org/docs/app) — Server/Client patterns

## 🚀 Server Actions Best Practices (NEW)

### Purpose

Standardize how domains expose Server Actions to client components while keeping business logic organized and reusable.

### Folder Roles

1. `actions/` – **Pure business logic**
   - Functions performing CRUD / validation.
   - **No** `'use server'` directive – not passed directly to Client.
   - **No** `revalidatePath` or UI-oriented side effects.
2. `features/` – **Orchestrators (Server Actions)**
   - Export functions with `'use server'` directive.
   - Compose one or more functions from `actions/` & other services.
   - Handle cross-cutting concerns: `revalidatePath`, logging, auth checks, etc.
   - Only these orchestrator functions are passed to Client components (e.g., via props).
3. `ui/` – **Client Components**
   - Accept orchestrator action via props.
   - Wrap action with `useTransition` / `useActionState` for non-blocking UX.

### Naming Conventions

- Internal logic: `<verb><Entity>Action` e.g., `createEmployeeAction`.
- Orchestrator (exposed): `<verb><Entity>` e.g., `saveEmployee`.

### Example Flow (Employees Domain)

```
Form -> EmployeeDetails.client.tsx
      -> saveEmployee (server action, 'features/')
          ├─ createEmployeeAction / updateEmployeeAction (actions/)
          └─ revalidatePath('/employees')
```

### Guidelines

- **Single Responsibility**: `actions/` functions never trigger cache revalidation; keep side-effects in orchestrators.
- **Revalidation Once**: Call `revalidatePath` exactly in one place to avoid duplicates.
- **Typed Input**: Parse `FormData` with Zod or similar in `actions/`.
- **Explicit Exports**: Re-export orchestrators via `index.server.ts` only.
- **Client Safety**: Never export server code from `index.ts`.

### Checklist

- [ ] `actions/*.server.ts` without `'use server'` & without UI concerns.
- [ ] `features/*.server.ts` with `'use server'`, orchestrates call & revalidate.
- [ ] Client components use `useTransition` or `useActionState` for UX.
- [ ] No duplicate revalidations.

---

## 🚀 Server Actions Conventions — PROJECT RULE (UPDATED)

> This is the authoritative convention for Server Actions in this project. It supersedes earlier notes in this document about placing orchestrators under `features/`.

### Location & Naming

- All Server Actions must live in `domain/<domain>/infra/`.
- All Server Actions files must use the `*.actions.ts` suffix.
  - Examples: `infra/crud.actions.ts`, `infra/upload-file.actions.ts`.

### Mandatory File Header

- Each Server Actions module must start with the directive as the very first line (before any imports):

```ts
'use server';
```

### Export & Usage Rules

- Никогда не ре-экспортируйте Server Actions из `index.ts` (client-safe index).
- Все Server Actions экспортируются через `index.server.ts` домена ИЛИ импортируются точечно из `infra/*.actions.ts`.
- Клиентские компоненты МОГУТ напрямую импортировать и вызывать Server Actions СВОЕГО агрегата (только `infra/*.actions.ts`). Импорт из `index.server.ts` в клиентских файлах ЗАПРЕЩЁН.
- Для междоменного использования — передавать действия через props или форму (`action`). Прямой импорт Server Actions чужого агрегата в клиенте запрещён.

### Coexistence With Other File Types

- Keep other server-only infrastructure/services as `*.server.ts` (e.g., S3, DB wrappers). Use `'server-only'` in those files.
- Shared logic (pure functions/types) remains in `*.shared.ts` or shared modules without directives.

### Legacy Domains (Migration Note)

- Older domains that currently use `features/*.server.ts` or `infra/*.server.ts` for orchestrators should be migrated to `infra/*.actions.ts` with `'use server'` at the top. This migration can be done incrementally.

### Quick Checklist (Server Actions)

- [ ] Файл расположен в `domain/<domain>/infra/`.
- [ ] Имя файла оканчивается на `.actions.ts`.
- [ ] Первая строка ровно `'use server';`.
- [ ] Экспортируется только через `index.server.ts`.
- [ ] Не импортируется напрямую в клиентские компоненты (ни внутри домена, ни из других доменов). Передача только через props/`action`.

### Examples

Good:

```ts
// domain/d002-files/infra/upload-file.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { filesRepositoryServer } from './file.repo.server';

export async function uploadFile(formData: FormData) {
  // ... validate, call repo, then:
  revalidatePath('/files');
}
```

Bad:

```ts
// features/upload-file.server.ts        // ❌ Wrong folder & suffix
// actions/uploadFile.server.ts          // ❌ Wrong folder & suffix
// infra/upload-file.server.ts           // ❌ Missing .actions.ts and directive
```

### 🗂️ Имя файла оркестратора

> **Правило:** _`<use-case>[.<entity>].server.ts`_  
> • Если файл лежит внутри домена, сущность (`employee`, `file`, …) **можно опустить**, если контекст ясен.  
> • Добавляем сущность только когда название становится двусмысленным при поиске/открытии без полного пути.

Примеры:
| Хорошо | Пояснение |
|--------|-----------|
| `create.server.ts` | Находится в `features/employee/` — контекст ясен. |
| `deactivate-employee.server.ts` | Находится в `features/`, но рядом много других use-case — добавляем сущность. |
| `syncWithS3.server.ts` | Специфическая операция, сущность не нужна. |
| `crud.server.ts` | Один файл инкапсулирует все CRUD операции сущности (current pattern). |

Антипаттерны:
| Плохо | Почему |
|-------|--------|
| `manage-employees.server.ts` | «manage» размыто, `employees` повторяет имя домена; unclear use-case. |
| `actions.server.ts` | Не отражает смысла, путает со слоем `actions/`. |

---

### ⚙️ Имя файлов в `actions/`

> **Правило:** Когда в одном файле собираются низкоуровневые CRUD-функции сущности, используйте `crud.actions.server.ts`.  
> Если функции становятся крупными или требуют разных зависимостей — разделяйте на `<verb>.action.server.ts` (например, `create.action.server.ts`).

---

## catalog-employees-d003: правила структуры файлов

### Организация ORM схем

**Правило:** Все ORM данные доменов размещаются **ТОЛЬКО** в файлах `'./domain/**/infra/orm.server.ts'`.

- Обязательные артефакты домена:
  - `infra/orm.server.ts` — серверный файл с ORM/Drizzle-схемами (обязательно `import 'server-only'`).
  - `types.shared.ts` — клиент-безопасные типы и Zod-реэкспорты (без серверных зависимостей).
- Эти артефакты обеспечивают явное разделение между серверной логикой (ORM в `infra/`) и универсальными типами/валидацией (`types.shared.ts`).
- Импортировать ORM-схемы только из `infra/orm.server.ts`, а типы/Zod-схемы — только из `types.shared.ts`.

### Системные таблицы

- **Системные таблицы** (например, `users`) размещаются в `'./shared/database/schemas/*'`
- **Запрещено**: Импорты из доменов в `shared/database/schemas` - это правило отменяется

### Конфигурация Drizzle

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: [
    './shared/database/schemas/*', // Системные таблицы
    './domain/**/infra/orm.server.ts' // Доменные ORM схемы
  ]
  // ...
});
```

---
