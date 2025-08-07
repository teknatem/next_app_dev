# Оптимальное размещение ORM, Zod-схем и типов (синхронизировано с catalog-bots-d001)

## 🎯 Принципы

- **Чёткое разделение контекстов**: серверное — только на сервере; общие схемы — безопасны для клиента.
- **Единообразие**: одинаковая структура во всех доменах.
- **DRY**: одно место определения на каждый артефакт (ORM, Zod, типы, enum'ы).

## 📁 Стандартная структура домена

```
domains/<domain-name>/
├── infra/
│   └── orm.server.ts          # ⚠️ SERVER-ONLY: Drizzle ORM-схемы (как в catalog-bots-d001)
├── model/
│   ├── enums.ts               # ✅ SHARED: перечисления домена (as const + типы)
│   └── schemas.shared.ts      # ✅ SHARED: Zod-схемы (клиент/сервер)
├── types.shared.ts            # ✅ SHARED: типы на основе Zod + реэкспорт схем/enum'ов
├── index.ts                   # ✅ CLIENT-SAFE: публичный API для клиента
├── index.server.ts            # ⚠️ SERVER-ONLY: публичный API для сервера
└── ... остальной код домена (data/ui/lib/etc.)
```

## 🔧 Детальная спецификация

### 1) ORM: `infra/orm.server.ts`

```typescript
import 'server-only';
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean
} from 'drizzle-orm/pg-core';
import { users } from '@/shared/database/schemas/users';

export const dXXXEntities = pgTable('dXXX_entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),
  title: text('title').notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id)
});

export type DXXXEntityRecord = typeof dXXXEntities.$inferSelect;
export type NewDXXXEntityRecord = typeof dXXXEntities.$inferInsert;
```

Правила:

- Всегда добавляйте `import 'server-only'`.
- Никаких Zod/React/браузерных зависимостей внутри ORM.

### 2) Zod-схемы: `model/schemas.shared.ts`

```typescript
import { z } from 'zod';
import { DOMAIN_ENUM_A, DOMAIN_ENUM_B } from './enums';

export const entitySchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(0),
  title: z.string().min(1).max(255)
  // ... остальные поля и правила валидации
});

export const formEntitySchema = entitySchema.omit({
  id: true,
  version: true
  // ... audit поля
});
```

Правила:

- Только общие зависимости (zod, константы/enum'ы из `model/enums.ts`).
- Никаких серверных импортов (Drizzle/Node-модулей) и UI/React.

### 3) Типы и публичные схемы: `types.shared.ts`

```typescript
import { z } from 'zod';
import { entitySchema, formEntitySchema } from './model/schemas.shared';
import { DOMAIN_ENUM_A, DOMAIN_ENUM_B } from './model/enums';

export type Entity = z.infer<typeof entitySchema>;
export type NewEntity = z.infer<typeof formEntitySchema>;

// Клиент-безопасный публичный API схем и enum'ов
export { entitySchema, formEntitySchema, DOMAIN_ENUM_A, DOMAIN_ENUM_B };
```

Правила:

- Файл клиент-безопасный: никаких серверных импортов.
- Явный реэкспорт Zod-схем и enum'ов — удобно для клиентского кода и других доменов.

### 4) Индексы

`index.ts` (client-safe): экспортирует только client-safe сущности (типы, Zod-схемы, клиентские UI-компоненты, константы).

`index.server.ts` (server-only): экспортирует server actions/репозитории/серверные обёртки UI + shared сущности по необходимости.

## ✅ Чек-лист соответствия

- ORM находится в `infra/orm.server.ts` и помечен `server-only`.
- Zod-схемы — в `model/schemas.shared.ts` (клиент/сервер).
- `types.shared.ts` содержит типы на основе Zod и реэкспортирует схемы/enum'ы.
- `index.ts` — без серверных экспортов, `index.server.ts` — только серверный код.

## 🔄 Миграция других доменов

1. Переместить ORM в `infra/orm.server.ts` (если иначе).
2. Вынести Zod в `model/schemas.shared.ts` (если были в `types.shared.ts`).
3. Обновить `types.shared.ts` для типов/реэкспортов.
4. Проверить индексы на client/server разделение.
