# Оптимальное размещение ORM, Zod схем и типов

## 🎯 Принципы архитектуры

### 1. Строгое разделение сервер/клиент

- **ORM (Drizzle)**: Только сервер, никогда не должны попадать в клиентский бандл
- **Zod схемы**: Нужны на клиенте (валидация форм) И на сервере (валидация API)
- **TypeScript типы**: Нужны везде

### 2. Единообразие между доменами

- Все домены должны следовать одинаковой структуре
- Никаких исключений и "особых случаев"

### 3. Принцип DRY

- Одна схема - одно место определения
- Никакого дублирования между доменами и shared/

## 📁 Рекомендуемая структура домена

```
domains/<domain-name>/
├── orm.server.ts              # ⚠️ SERVER-ONLY - Drizzle ORM схемы
├── types.shared.ts            # ✅ SHARED - Zod схемы + TypeScript типы
├── model/                     # ✅ SHARED - Дополнительные модели (по необходимости)
│   ├── enums.ts               # Enum'ы домена
│   └── validators.ts          # Сложные кастомные валидаторы (если нужны)
├── index.ts                   # ✅ CLIENT-SAFE экспорты
├── index.server.ts            # ⚠️ SERVER-ONLY экспорты
└── ...остальные слои
```

## 🔧 Детальная спецификация

### 1. `orm.server.ts` - Серверные ORM схемы

```typescript
'use server-only';

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean
} from 'drizzle-orm/pg-core';
import { users } from '@/shared/database/schemas/users';

// ТОЛЬКО Drizzle таблицы и их конфигурация
export const d002Files = pgTable('d002_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),
  title: text('title').notNull()
  // ... другие поля
});

// Базовые типы для внутреннего использования в репозиториях
export type D002FileRecord = typeof d002Files.$inferSelect;
export type NewD002FileRecord = typeof d002Files.$inferInsert;
```

**Правила:**

- ✅ Только Drizzle `pgTable` определения
- ✅ Директива `'use server-only'` обязательна
- ✅ Минимальные TypeScript типы для репозиториев
- ❌ НЕТ Zod схем
- ❌ НЕТ сложных бизнес-типов

### 2. `types.shared.ts` - Типы и валидация

```typescript
// НЕТ серверных импортов!
import { z } from 'zod';

// Zod схемы для валидации
export const fileSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(0),
  title: z.string().min(1).max(255),
  description: z.string().optional()
  // ... другие поля
});

export const createFileSchema = fileSchema.omit({
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true
});

export const updateFileSchema = fileSchema.partial().extend({
  id: z.string().uuid(),
  version: z.number().int().min(0)
});

// TypeScript типы
export type File = z.infer<typeof fileSchema>;
export type CreateFile = z.infer<typeof createFileSchema>;
export type UpdateFile = z.infer<typeof updateFileSchema>;

// Поисковые схемы
export const fileSearchSchema = z.object({
  query: z.string().optional(),
  mimeType: z.string().optional()
});
export type FileSearch = z.infer<typeof fileSearchSchema>;
```

**Правила:**

- ✅ Все Zod схемы для валидации
- ✅ Все бизнес-типы TypeScript
- ✅ Поисковые и фильтрационные схемы
- ❌ НЕТ серверных импортов (Drizzle, Node.js modules)

### 3. `model/enums.ts` - Перечисления домена

```typescript
// Только перечисления и константы
export const FILE_STATUSES = ['draft', 'published', 'archived'] as const;
export type FileStatus = (typeof FILE_STATUSES)[number];

export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf'
] as const;
export type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number];
```

### 4. Экспорты в index файлах

**`index.ts` (client-safe):**

```typescript
// ✅ Только client-safe экспорты
export * from './types.shared';
export * from './model/enums';
export { FileList } from './ui/file.list.client';
export { FileDetails } from './ui/file.details.client';
```

**`index.server.ts` (server-only):**

```typescript
'use server-only';

// ✅ Серверные + shared экспорты
export * from './orm.server';
export * from './types.shared';
export * from './model/enums';
export { fileRepositoryServer } from './data/file.repo.server';
```

## 🗄️ Размещение в shared/database/schemas

### Правило: Только реэкспорты, никакого дублирования

```typescript
// shared/database/schemas/d002_files.ts
export { d002Files } from '@/domains/catalog-files-d002/orm.server';
```

**НЕ делать:**

```typescript
// ❌ Дублирование определения схемы
export const d002Files = pgTable(/* определение здесь */);
export { d002Files as duplicatedFiles } from '@/domains/catalog-files-d002/orm.server';
```

## 🔄 План миграции

### Этап 1: Исправить catalog-files-d002

1. Разделить `model/files.schema.ts` на `orm.server.ts` + `types.shared.ts`
2. Обновить импорты в зависимых файлах
3. Создать реэкспорт в `shared/database/schemas/`

### Этап 2: Очистить дублирование в shared/

1. Удалить дублированные определения из `shared/database/schemas/d003_employees.ts`
2. Оставить только реэкспорты

### Этап 3: Стандартизировать остальные домены

1. Проверить соответствие всех доменов новой структуре
2. Обновить документацию

## ✅ Преимущества решения

1. **Безопасность**: ORM схемы не попадут в клиентский бандл
2. **Переиспользование**: Zod схемы работают и на клиенте, и на сервере
3. **Единообразие**: Все домены следуют одной структуре
4. **Производительность**: Минимальный размер клиентского бандла
5. **Поддержка**: Легко понять где что лежит

## 🚫 Анти-паттерны

- ❌ Смешивание ORM и Zod в одном файле
- ❌ Дублирование схем между доменом и shared/
- ❌ Импорт серверных модулей в types.shared.ts
- ❌ Экспорт ORM схем из index.ts (client-safe)
- ❌ Создание отдельных файлов для каждого типа (избыточная сложность)
