# catalog-employees-d003 — Домен сотрудников (FSDDD)

## Описание

Домен для управления сотрудниками компании с полной CRUD функциональностью.

## Структура

```
domains/catalog-employees-d003/
├── model/                    # Shared types & schemas
│   └── employees.schema.ts
├── data/                     # Server-only DB operations
│   └── employee.repo.server.ts
├── actions/                  # Server-only Server Actions
│   └── employee-actions.server.ts
├── ui/                       # React components (Server + Client)
│   ├── employee-form.tsx     # Server Component
│   ├── employee-list-client.tsx # Client Component
│   └── deactivate-employee-button.tsx # Server Component
├── index.ts                  # Client-safe barrel
├── index.server.ts           # Server-only barrel
└── README.md                 # Документация
```

## Экспорт

- **index.ts**: UI компоненты, shared types/utilities
- **index.server.ts**: server-only сервисы, репозитории, actions

## Примеры использования

### В React-компоненте (client)

```ts
import { EmployeeList, EmployeeForm } from '@/domains/catalog-employees-d003';
```

### В Server Component или API route (server)

```ts
import {
  employeeRepositoryServer,
  createEmployeeAction,
  getEmployeesAction
} from '@/domains/catalog-employees-d003/index.server';
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
- Используются Server Actions для CRUD операций
- Нет прямых импортов из внутренних модулей вне домена
- Только два index файла: client-safe и server-only
