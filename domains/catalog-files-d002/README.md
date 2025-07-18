# catalog-files-d002 — Эталонный домен (FSDDD)

## Структура

```
domains/catalog-files-d002/
├── model/                # Shared types & schemas
│   └── files.schema.ts
├── data/                 # Server-only DB operations
│   └── file.repo.server.ts
├── api/                  # Client-only HTTP API calls
│   └── file.api.client.ts
├── actions/              # Server-only business logic
│   └── crud.actions.server.ts
├── features/             # Server Actions (orchestrators)
│   └── crud.server.ts
├── lib/                  # Shared & server-only utilities
│   ├── date-utils.ts     # Shared
│   └── s3.service.server.ts # Server-only
├── ui/                   # Client-only React components
│   ├── file.list.client.tsx
│   ├── file.uploader.client.tsx
│   ├── file.details.client.tsx
│   └── file.picker.client.tsx
├── index.ts              # Client-safe barrel
├── index.server.ts       # Server-only barrel
└── README.md             # Документация
```

## Экспорт

- **index.ts**: UI components, client API, shared types/utilities
- **index.server.ts**: Server Actions, repositories, server services, shared types/utilities

## Примеры использования

### В React-компоненте (client)

```ts
import {
  FileList,
  FileUploader,
  fileApiClient
} from '@/domains/catalog-files-d002';
```

### В Server Component или API route (server)

```ts
import {
  fileRepository,
  getPresignedUploadUrl,
  createFile,
  softDeleteFile
} from '@/domains/catalog-files-d002/index.server';
```

### Использование Server Actions в клиентских компонентах

```tsx
'use client';

import { useTransition } from 'react';
import {
  createFile,
  softDeleteFile
} from '@/domains/catalog-files-d002/features/crud.server';

export function MyComponent() {
  const [isPending, startTransition] = useTransition();

  const handleCreateFile = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createFile(formData);
      if (result.success) {
        console.log('File created:', result.data);
      } else {
        console.error('Error:', result.error);
      }
    });
  };

  const handleDeleteFile = async (id: string) => {
    startTransition(async () => {
      const result = await softDeleteFile(id);
      if (result.success) {
        console.log('File deleted');
      } else {
        console.error('Error:', result.error);
      }
    });
  };

  return (
    <div>
      <button onClick={() => handleDeleteFile('file-id')} disabled={isPending}>
        {isPending ? 'Deleting...' : 'Delete File'}
      </button>
    </div>
  );
}
```

## Обязательные UI виджеты

Домен предоставляет следующие обязательные UI виджеты согласно FSDDD:

1. **FileList** (`file.list.client.tsx`) - Список файлов с пагинацией и фильтрацией
2. **FileDetails** (`file.details.client.tsx`) - Детальная информация о файле с возможностью редактирования
3. **FilePicker** (`file.picker.client.tsx`) - Виджет выбора файлов для связывания с другими доменами
4. **FileUploader** (`file.uploader.client.tsx`) - Загрузка файлов с интеграцией S3

## Правила

- Все server-only файлы имеют суффикс `.server.ts` и директиву `import 'server-only';`
- Все client-only файлы имеют суффикс `.client.ts` и директиву `'use client'`
- UI компоненты следуют конвенции `<entity>.<widget_type>.client.tsx`
- Server Actions экспортируются как отдельные функции из `features/`
- Нет прямых импортов из внутренних модулей вне домена
- Только два index файла: client-safe и server-only

_Этот домен служит эталонным примером для всех новых доменов проекта._
