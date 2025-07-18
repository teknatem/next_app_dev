# Document Meetings Domain (d004)

Домен для работы с совещаниями и их документацией.

## Возможности

- **Управление совещаниями**: создание, редактирование, удаление совещаний
- **Управление файлами**: загрузка и управление файлами совещаний
- **AI транскрибация**: автоматическая транскрибация аудио файлов с помощью AssemblyAI
- **Редактирование транскрибации**: интерактивное редактирование результатов транскрибации
- **Поиск совещаний**: поиск по различным параметрам
- **Статистика**: отслеживание количества файлов и артефактов

## Новая функциональность: Транскрибация с AssemblyAI

### Настройка

1. Добавьте ваш API ключ AssemblyAI в `.env.local`:

```
ASSEMBLYAI_API_KEY=ваш_ключ_здесь
```

2. Убедитесь, что у вас есть действующий API ключ от [AssemblyAI](https://www.assemblyai.com/)

### Использование

#### В интерфейсе:

1. Откройте детали совещания
2. Перейдите на вкладку "Файлы"
3. Для аудио файлов увидите кнопку "Транскрибировать"
4. Нажмите кнопку для запуска транскрибации
5. Дождитесь завершения (статус изменится на "Транскрибирован")
6. Нажмите "Скачать JSON" для получения результата

#### Статусы транскрибации:

- **В очереди**: транскрибация добавлена в очередь
- **Обработка...**: AssemblyAI обрабатывает файл
- **Транскрибирован**: готов результат (можно скачать JSON)
- **Ошибка**: произошла ошибка (можно повторить)

### Структура результата

Результат транскрибации сохраняется в JSON формате и включает:

```json
{
  "text": "Полный текст транскрипции",
  "confidence": 0.95,
  "words": [
    {
      "text": "слово",
      "start": 0,
      "end": 1.5,
      "confidence": 0.98
    }
  ],
  "paragraphs": [
    {
      "text": "Абзац текста",
      "start": 0,
      "end": 10,
      "confidence": 0.95,
      "words": [...]
    }
  ],
  "metadata": {
    "provider": "AssemblyAI",
    "language": "ru",
    "transcriptId": "id_транскрипции"
  }
}
```

### Технические детали

#### Архитектура

- `assemblyai.service.server.ts`: сервис для работы с AssemblyAI API
- `crud.actions.server.ts`: server actions для управления транскрипцией
- `meeting.details.client.tsx`: UI компонент для запуска и отображения результатов

#### Поток обработки

1. Пользователь нажимает "Транскрибировать"
2. Создается артефакт со статусом "queued"
3. Асинхронно запускается обработка:
   - Файл загружается в AssemblyAI
   - Запускается транскрибация
   - Ожидание завершения
   - Результат сохраняется в базу данных
4. UI автоматически обновляется при изменении статуса

#### Поддерживаемые языки

- Русский (ru) - по умолчанию
- Английский (en)
- Другие языки поддерживаемые AssemblyAI

### Редактирование транскрибации

После завершения транскрибации доступно интерактивное редактирование результатов:

1. В детальной странице совещания нажмите "Редактировать транскрибацию"
2. Редактируйте сегменты транскрибации в таблице:
   - Время начала и окончания
   - Спикер
   - Текст
3. Добавляйте и удаляйте сегменты
4. Редактируйте резюме транскрибации
5. Просматривайте исходные данные (payload) в режиме только для чтения

#### Функции редактора:

- **Автоматическое создание сегментов**: из исходных данных AssemblyAI
- **Валидация временных меток**: проверка корректности времени
- **Экспорт данных**: скачивание результатов в JSON формате
- **Интерактивное редактирование**: изменение каждого сегмента отдельно

### Расширение функциональности

Для добавления новых AI провайдеров:

1. Создайте новый сервис в `lib/`
2. Обновите `processTranscriptionAsync` в `crud.actions.server.ts`
3. Добавьте нового провайдера в UI

## Структура файлов

```
domains/document-meetings-d004/
├── actions/
│   └── crud.actions.server.ts      # Server actions
├── data/
│   └── meeting.repo.server.ts      # Database repository
├── lib/
│   ├── ai-processing.server.ts     # AI processing service
│   ├── assemblyai.service.server.ts # AssemblyAI integration
│   ├── transcription-parser.ts     # Transcription data parser
│   └── date-utils.ts              # Date utilities
├── model/
│   └── meetings.schema.ts          # Database schemas
├── ui/
│   ├── meeting.details.client.tsx  # Main details component
│   ├── meeting.list.client.tsx     # List component
│   ├── meeting-asset-manager.client.tsx # Asset management
│   └── transcription-editor.client.tsx # Transcription editor
├── index.ts                        # Client exports
├── index.server.ts                 # Server exports
└── README.md                       # This file
```

## Использование в коде

### Server Actions

```typescript
import {
  createTranscriptionAction,
  getTranscriptionDataAction,
  saveTranscriptionAction
} from '@/domains/document-meetings-d004/index.server';

// Запуск транскрибации
const result = await createTranscriptionAction({
  assetId: 'uuid-asset-id',
  language: 'ru',
  provider: 'AssemblyAI'
});

// Получение данных транскрибации для редактирования
const transcriptionData = await getTranscriptionDataAction(artefactId);

// Сохранение отредактированной транскрибации
const saveResult = await saveTranscriptionAction({
  artefactId,
  result: editedResult,
  summary: editedSummary
});
```

### Repository

```typescript
import { meetingRepositoryServer } from '@/domains/document-meetings-d004/index.server';

// Получение артефактов
const artefacts = await meetingRepositoryServer.getArtefactsByAssetId(assetId);
```

### Components

```typescript
import { MeetingDetails, TranscriptionEditor } from '@/domains/document-meetings-d004';

// Использование в React компоненте
<MeetingDetails
  meeting={meeting}
  assets={assets}
  artefacts={artefacts}
  createTranscriptionAction={createTranscriptionAction}
  // ... другие props
/>

// Редактор транскрибации
<TranscriptionEditor
  artefactId={artefactId}
  initialData={transcriptionData}
  onSave={async (data) => {
    await saveTranscriptionAction({
      artefactId,
      result: data.result,
      summary: data.summary
    });
  }}
/>
```

## Тестирование

Для тестирования интеграции с AssemblyAI:

```bash
npx tsx scripts/test-assemblyai-simple.ts
```

## Требования

- Node.js 18+
- ASSEMBLYAI_API_KEY в переменных окружения
- Подключение к интернету для AssemblyAI API
- База данных с таблицами meetings, meeting_assets, meeting_artefacts
