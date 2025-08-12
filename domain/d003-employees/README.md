# catalog-employees-d003 — Домен сотрудников

## Описание

Домен для управления сотрудниками компании с полной CRUD функциональностью.

## Структура

```
domain/d003-employees/
├── infra/                    # Server-only infrastructure
│   ├── orm.server.ts         # Drizzle ORM schemas ('server-only')
│   └── crud.actions.ts       # Server Actions ('use server')
├── data/                     # Server-only DB operations
│   └── employee.repo.server.ts
├── model/
│   └── enums.shared.ts       # Shared enums (client-safe)
├── lib/
│   └── date-utils.shared.ts  # Shared utilities (client-safe)
├── ui/                       # UI (one widget — one folder)
│   ├── employees-list/
│   ├── employees-details/
│   └── employees-picker/
├── index.ts                  # Client-safe barrel
├── index.server.ts           # Server-only barrel
└── README.md                 # Документация
```

## Экспорт

- **index.ts**: UI компоненты, shared types/utilities (без Server Actions)
- **index.server.ts**: server-only сервисы, репозитории, Server Actions

## Примеры использования

### В React-компоненте (client)

```ts
import { EmployeeList, EmployeeDetails } from '@/domain/catalog-employees-d003';
```

### В Server Component или API route (server)

```ts
import {
  employeeRepositoryServer,
  createEmployeeAction,
  getEmployeesAction
} from '@/domain/catalog-employees-d003/index.server';
```

## Функциональность

- ✅ Создание новых сотрудников
- ✅ Редактирование существующих сотрудников
- ✅ Деактивация сотрудников (soft delete)
- ✅ Поиск по имени
- ✅ Фильтрация по отделу
- ✅ Фильтрация по статусу (активный/неактивный)
- ✅ Получение списка отделов и должностей

## Структура данных

| Поле         | Тип данных    | Описание                                   |
| ------------ | ------------- | ------------------------------------------ |
| `id`         | `uuid` PK     | Уникальный идентификатор сотрудника        |
| `fullName`   | `text`        | ФИО полностью                              |
| `email`      | `text`        | Корпоративный email (уникальный, nullable) |
| `position`   | `text`        | Должность                                  |
| `department` | `text`        | Подразделение / отдел                      |
| `isActive`   | `boolean`     | Активный ли сотрудник                      |
| `isDeleted`  | `boolean`     | Помечен ли как удаленный (soft delete)     |
| `createdAt`  | `timestamptz` | Дата добавления записи                     |
| `updatedAt`  | `timestamptz` | Дата последнего обновления                 |

## Правила

- Все server-only файлы имеют суффикс `.server.ts` и директиву `import 'server-only';`
- Server Components для форм и кнопок действий
- Client Components только для интерактивных элементов (диалоги, фильтры)
- Server Actions находятся только в `infra/*.actions.ts` и экспортируются через `index.server.ts`
- Клиентские компоненты не импортируют Server Actions напрямую — передача через props / form `action`
- Нет прямых импортов из внутренних модулей вне домена
- Только два index файла: client-safe и server-only
