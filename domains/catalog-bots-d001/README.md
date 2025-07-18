# Catalog Bots Domain (catalog-bots-d001)

Домен для управления AI ботами-сотрудниками в системе.

## 🎯 Назначение

Домен `catalog-bots-d001` предоставляет полный функционал для создания, редактирования и управления AI ботами-сотрудниками. Каждый бот имеет настройки личности, внешнего вида и AI конфигурации.

## 📊 Структура данных

### Основные поля бота:

- **Идентификация**: `id`, `name`, `version`
- **Личность**: `gender`, `position`, `hierarchyLevel`
- **Внешний вид**: `avatarUrl`, `primaryColor`
- **AI конфигурация**: `role`, `goals`, `rules`, `llmProvider`, `llmModel`
- **Системные**: `isDeleted`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

### Поддерживаемые провайдеры LLM:

- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Yandex**: Yandex GPT, Yandex GPT Lite
- **Google**: Gemini Pro, Gemini Flash
- **Mistral**: Mistral Large, Mistral Medium, Mistral Small

## 🏗️ Архитектура

### Слои домена:

```
domains/catalog-bots-d001/
├── model/                    # ✅ SHARED - Схемы и типы
│   └── bots.schema.ts       # Zod схемы + TypeScript типы
├── data/                     # ⚠️ SERVER-ONLY - Операции с БД
│   └── bot.repo.server.ts   # Репозиторий с 'server-only'
├── api/                      # ✅ CLIENT-ONLY - HTTP API
│   └── bot.api.client.ts    # Клиентский API с 'use client'
├── actions/                  # ⚠️ SERVER-ONLY - Действия
│   └── crud.actions.server.ts # CRUD действия
├── features/                 # ⚠️ SERVER-ONLY - Функции
│   └── crud.server.ts       # CRUD функции
├── ui/                       # 🔄 MIXED - React компоненты
│   ├── bot.list.client.tsx  # ✅ CLIENT-ONLY - Список ботов
│   ├── bot.details.client.tsx # ✅ CLIENT-ONLY - Детали бота
│   └── bot.picker.client.tsx # ✅ CLIENT-ONLY - Выбор бота
├── index.ts                  # ✅ CLIENT-SAFE - Публичный API для клиента
├── index.server.ts           # ⚠️ SERVER-ONLY - Публичный API для сервера
└── README.md                 # Документация
```

## 🎨 UI Компоненты

### BotList

Компонент для отображения списка ботов с возможностями:

- Поиск по имени, должности, провайдеру
- Сортировка по различным полям
- Пагинация
- Действия: просмотр, редактирование, удаление

### BotDetails

Компонент для просмотра и редактирования бота:

- Режимы: просмотр, редактирование, создание
- Валидация форм
- Группировка полей по категориям
- Отображение системной информации

### BotPicker

Компонент для выбора ботов:

- Одиночный и множественный выбор
- Поиск в реальном времени
- Отображение выбранных элементов
- Поддержка disabled состояния

## 🔧 Использование

### В клиентском коде:

```typescript
import {
  BotList,
  BotDetails,
  BotPicker,
  botApiClient,
  type Bot
} from '@/domains/catalog-bots-d001';

// Список ботов
<BotList
  onEdit={(bot) => handleEdit(bot)}
  onView={(bot) => handleView(bot)}
  onDelete={(bot) => handleDelete(bot)}
  onCreate={() => handleCreate()}
/>

// Детали бота
<BotDetails
  botId="bot-id"
  mode="view"
  onSave={(bot) => handleSave(bot)}
/>

// Выбор бота
<BotPicker
  selectedBots={selectedBots}
  onSelect={(bots) => setSelectedBots(bots)}
  multiple={true}
/>
```

### В серверном коде:

```typescript
import {
  botRepository,
  botActions,
  botCrudServer
} from '@/domains/catalog-bots-d001/index.server';

// Использование репозитория
const bots = await botRepository.getBots({ limit: 10 });

// Использование действий
const result = await botActions.createBotAction(formData);

// Использование CRUD функций
const result = await botCrudServer.createBot(formData);
```

## 📝 API Endpoints

Домен предполагает следующие API endpoints:

- `GET /api/bots` - Получение списка ботов
- `POST /api/bots` - Создание нового бота
- `GET /api/bots/:id` - Получение бота по ID
- `PUT /api/bots/:id` - Обновление бота
- `DELETE /api/bots/:id` - Мягкое удаление бота
- `GET /api/bots/hierarchy/:level` - Боты по уровню иерархии
- `GET /api/bots/provider/:provider` - Боты по провайдеру

## 🔒 Валидация

Все данные проходят валидацию через Zod схемы:

- `formBotSchema` - для создания бота
- `updateBotSchema` - для обновления бота
- `insertBotSchema` - для вставки в БД
- `selectBotSchema` - для выборки из БД

## 🎨 Стилизация

Каждый бот имеет основной цвет (`primaryColor`), который используется для:

- Окраски связанных UI элементов
- Визуального выделения в интерфейсе
- Создания персонализированного опыта

## 🔄 Интеграция

Домен интегрируется с:

- Системой аутентификации (поле `createdBy`, `updatedBy`)
- Системой мягкого удаления (`isDeleted`, `deletedAt`, `deletedBy`)
- Системой версионирования (`version`)

## 🚀 Развитие

Планируемые улучшения:

- Интеграция с системой аватаров
- Расширенная система ролей и разрешений
- Аналитика использования ботов
- Шаблоны конфигураций
- Массовые операции
