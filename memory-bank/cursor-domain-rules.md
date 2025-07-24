# Cursor Domain Rules - Next.js FSD Project

## 🎯 CRITICAL: Domain Structure Rules

### **Always follow these rules when working with domains in this project**

---

## ⭐️ NEW: Model Layer and Enums

Для обеспечения максимальной консистентности и строгого разделения ответственности, вводится папка `model/` на уровне каждого домена.

### **1. Расположение Enum'ов (`enums.ts`)**

- **Правило:** Все перечисления (enums), используемые в домене, **ДОЛЖНЫ** определяться в файле `domains/<domain>/model/enums.ts`.
- **Формат:** Рекомендуется использовать `as const` для создания строковых enum'ов и экспортировать как константу, так и тип.

  ```typescript
  // domains/<domain>/model/enums.ts

  export const MEETING_ASSET_KINDS = ['document', 'audio', 'video'] as const;
  export type MeetingAssetKind = (typeof MEETING_ASSET_KINDS)[number];
  ```

- **Причина:** Централизация всех возможных состояний и типов в одном месте упрощает поддержку и снижает риск ошибок. Файл `enums.ts` становится единственным источником правды для всех перечислений в домене.

### **2. Другие файлы в `model/`**

- Папка `model/` также может содержать другие файлы, описывающие основную модель данных домена, если это необходимо (например, сложные схемы валидации, которые не являются частью `types.shared.ts`).

---

## 📁 Domain Structure Template

```
domains/
└── <domain-name>/
    ├── orm.server.ts        # ⚠️ SERVER-ONLY - ORM/Drizzle-схемы, только для сервера (с директивой 'server-only')
    ├── types.shared.ts      # ✅ SHARED - Типы и Zod-схемы, используются и на клиенте, и на сервере
    ├── model/               # ✅ SHARED - Domain data models and enums
    │   └── enums.ts              # Domain-specific enums
    ├── data/               # ⚠️ SERVER-ONLY - Database operations
    │   └── *.repo.server.ts      # Repository with 'server-only' directive
    ├── api/                # ✅ CLIENT-ONLY - HTTP API calls
    │   └── *.api.client.ts       # Client API with 'use client' directive
    ├── lib/                # 🔄 MIXED - Utilities and services (OPTIONAL)
    │   ├── *.shared.ts           # ✅ SHARED - Pure functions, no side effects
    │   ├── *.server.ts           # ⚠️ SERVER-ONLY - S3, external APIs, email services
    │   └── *.client.ts           # ✅ CLIENT-ONLY - Browser-specific logic, validation
    ├── ui/                 # 🔄 MIXED - React components
    │   ├── *.server.tsx          # ⚠️ SERVER-ONLY - Server Components
    │   └── *.client.tsx          # ✅ CLIENT-ONLY - Client Components
    ├── index.ts            # ✅ CLIENT-SAFE - Public API for client
    ├── index.server.ts     # ⚠️ SERVER-ONLY - Public API for server
    └── README.md           # Documentation
```

---

## 📦 Папка `lib/` (Необязательная)

### **Назначение:**

Папка `lib/` содержит утилиты, сервисы и вспомогательные функции, которые не относятся к основным слоям домена (data, ui, actions, features).

### **Когда использовать:**

- **Утилиты**: функции форматирования, валидации, преобразования данных
- **Сервисы**: интеграции с внешними API, S3, email-сервисы
- **Константы**: перечисления, конфигурационные значения
- **Хелперы**: вспомогательные функции для бизнес-логики

### **Когда НЕ использовать:**

- Для простых доменов без дополнительной логики
- Если утилиты можно разместить в других слоях
- Если функциональность минимальна

### **Примеры файлов:**

```
lib/
├── date-utils.ts              # Форматирование дат
├── validation.utils.ts        # Валидация форм
├── email.service.server.ts    # Email-сервис
├── s3.service.server.ts       # S3 интеграция
└── constants.ts               # Константы домена
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
export { fileRepositoryServer } from './data/file.repo.server'; // Server data
export { getPresignedUploadUrlServer } from './lib/s3.service.server'; // Server services
```

---

## 💎 UI Widget Conventions

### **1. Разделение на серверные и клиентские компоненты (Server/Client Component Separation):**

- Все UI-компоненты, расположенные в `domains/<domain>/ui/`, по умолчанию являются серверными компонентами и должны иметь суффикс `.server.tsx`.
- Компоненты, требующие клиентской интерактивности (хуки React, обработчики событий), должны быть в файлах с суффиксом `.client.tsx` и содержать директиву `'use client'`.

### **2. Обязательные виджеты для доменов типа `catalog` и `document` (Mandatory Widgets for `catalog` and `document` domains):**

Для обеспечения консистентности, каждый домен типа `catalog` или `document` должен предоставлять следующий набор обязательных UI-виджетов. Именование должно следовать шаблону `<entity>.<widget_type>.client.tsx`, где `<entity>` — это основная сущность домена (например, `employee`, `file`).

- **Виджет списка элементов (List Widget):**

  - **Назначение:** Отображение списка сущностей с возможностью фильтрации, поиска и пагинации.
  - **Именование:** `<entity>.list.client.tsx`
  - **Пример:** `employees.list.client.tsx`

- **Виджет детальной информации (Details Widget):**

  - **Назначение:** Отображение полной информации об одной сущности. Может включать режимы просмотра и редактирования.
  - **Именование:** `<entity>.details.client.tsx`
  - **Пример:** `employees.details.client.tsx`

- **Виджет выбора элемента (Picker Widget):**
  - **Назначение:** Предоставление интерфейса для выбора одной или нескольких сущностей из списка. Используется для связывания сущностей между разными доменами.
  - **Именование:** `<entity>.picker.client.tsx`
  - **Экспорт:** Этот компонент **должен** экспортироваться из корневого `index.ts` домена, чтобы быть доступным для других доменов в клиентском коде.
  - **Пример:** `employees.picker.client.tsx`

---

## 🔥 MANDATORY File Naming Rules

### **Server Files (Node.js only)**

- **ALWAYS** use `.server.ts` suffix
- **ALWAYS** add `import 'server-only';` at the top
- **Examples:** `file.repo.server.ts`, `s3.service.server.ts`

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
import { fileRepository } from '@/domains/files/data/file.repo.server';

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
import { fileApiClient } from '@/domains/files';
import { fileRepositoryServer } from '@/domains/files/index.server';

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
} from '@/domains/files/index.server';
```

### **In React Components (Client Context)**

```typescript
// ✅ Use client index
import { fileApiClient, File } from '@/domains/files';
```

### **In Shared Utilities**

```typescript
// ✅ Import shared modules directly
import { toISOString } from '@/domains/files/lib/date-utils';
```

---

## 🏗️ Project Context

### **Technology Stack**

- **Next.js 15** with App Router
- **TypeScript** strict mode
- **Drizzle ORM** with PostgreSQL
- **Yandex Cloud S3** for object storage
- **Feature-Sliced Design** architecture

### **Key Principles**

1. **Server/Client Separation** - Explicit boundaries
2. **Minimal Index Files** - Two index files max per domain
3. **Type Safety** - Zod schemas + TypeScript
4. **Performance** - Tree-shaking friendly exports
5. **Scalability** - Domain-driven design

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

### **Эталонная реализация:**

- [domains/catalog-employees-d003/README.md](../domains/catalog-employees-d003/README.md) - **Эталонная реализация домена**
  - Полная CRUD функциональность
  - Правильная структура слоев
  - Server/Client разделение
  - Обязательные UI виджеты
  - Реализация Server actions

### **Дополнительные примеры:**

- [Feature-Sliced Design](https://feature-sliced.design/) - Official documentation
- [Next.js App Router](https://nextjs.org/docs/app) - Server/Client patterns

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

**Правило:** Все ORM данные доменов размещаются **ТОЛЬКО** в файлах `'./domains/**/orm.server.ts'`

- В корне домена должны быть два файла:
  - `orm.server.ts` — только серверный файл, содержит ORM/Drizzle-схемы и связан только с сервером (использует 'server-only' директиву).
  - `types.shared.ts` — файл с типами и Zod-схемами, которые могут использоваться как на сервере, так и на клиенте (без серверных зависимостей).
- Эти файлы обеспечивают явное разделение между серверной логикой (ORM) и универсальными типами/валидацией.
- Импортировать ORM-схемы только из `orm.server.ts`, а типы/Zod-схемы — только из `types.shared.ts`.

### Системные таблицы

- **Системные таблицы** (например, `users`) размещаются в `'./shared/database/schemas/*'`
- **Запрещено**: Импорты из доменов в `shared/database/schemas` - это правило отменяется

### Конфигурация Drizzle

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: [
    './shared/database/schemas/*', // Системные таблицы
    './domains/**/orm.server.ts' // Доменные ORM схемы
  ]
  // ...
});
```

---
