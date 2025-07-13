# catalog-files-d002 — Эталонный домен (FSDDD)

## Структура

```
domains/catalog-files-d002/
├── model/                # Shared types & schemas
│   └── files.schema.ts
├── data/                 # Server-only DB operations
│   └── file.repo.server.ts
├── lib/                  # Shared & server-only utilities
│   ├── date-utils.ts     # Shared
│   └── s3.service.server.ts # Server-only
├── ui/                   # Client-only React components
│   ├── file-list.tsx
│   ├── file-uploader.tsx
│   ├── file-details.tsx
│   └── file-picker.tsx
├── index.ts              # Client-safe barrel
├── index.server.ts       # Server-only barrel
└── README.md             # Документация
```

## Экспорт

- **index.ts**: UI, client API, shared types/utilities
- **index.server.ts**: server-only сервисы, репозитории, shared types/utilities

## Примеры использования

### В React-компоненте (client)

```ts
import { FileUploader, FileList } from '@/domains/catalog-files-d002';
```

### В API route (server)

```ts
import {
  fileRepository,
  getPresignedUploadUrl
} from '@/domains/catalog-files-d002/index.server';
```

## Правила

- Все server-only файлы имеют суффикс `.server.ts` и директиву `import 'server-only';`
- Все client-only компоненты используют `'use client'`
- Нет прямых импортов из внутренних модулей вне домена
- Только два index файла: client-safe и server-only

_Этот домен служит эталонным примером для всех новых доменов проекта._
