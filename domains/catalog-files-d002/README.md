# catalog-files-d002 — Доменно-ориентированный UI для работы с файлами

## Структура (актуальная)

```
domains/catalog-files-d002/
├── data/                         # ⚠️ server-only: доступ к БД
│   └── file.repo.server.ts
├── infra/                        # ⚠️ server actions (обяз. 'use server')
│   ├── crud.actions.ts
│   └── test-s3.actions.ts
├── lib/                          # shared/server utilities
│   ├── date-utils.ts             # ✅ shared
│   └── s3.service.server.ts      # ⚠️ server-only
├── model/                        # ✅ shared: enum/схемы домена (если есть)
│   └── ...
├── ui/                           # 🔄 RSC + Client Widgets (1 каталог = 1 виджет)
│   ├── file-list/
│   │   ├── file-list.client.tsx
│   │   └── index.ts
│   ├── file-details/
│   │   ├── file-details.client.tsx
│   │   └── index.ts
│   ├── file-uploader/
│   │   ├── file.uploader.client.tsx
│   │   └── index.ts
│   ├── file-picker/
│   │   ├── file.picker.client.tsx
│   │   └── index.ts
│   ├── image-picker/
│   │   ├── image.picker.client.tsx
│   │   └── index.ts
│   ├── files-page/
│   │   ├── files-page.client.tsx
│   │   └── index.ts
│   └── index.ts                  # агрегатор client-safe виджетов
├── orm.server.ts                 # ⚠️ server-only: ORM-схемы (если нужны)
├── types.shared.ts               # ✅ shared: типы и экспорт zod/enum
├── index.ts                      # ✅ client-safe barrel
├── index.server.ts               # ⚠️ server-only barrel
└── README.md
```

## Экспорт (двойной индекс)

- `index.ts` (client-safe): UI-виджеты, shared-типы/утилиты.
- `index.server.ts` (server-only): server actions из `infra/*.actions.ts`, репозитории, server-сервисы, а также shared-экспорты при необходимости.

## Использование

### В странице/серверном компоненте (рекомендуемый паттерн передачи экшенов)

```tsx
// app/(domains)/files/page.tsx
import {
  testS3Configuration,
  getPresignedUploadUrlAction,
  createFile,
  getFiles,
  softDeleteFile,
  updateFile
} from '@/domains/catalog-files-d002/index.server';
import { FilesPageClient } from '@/domains/catalog-files-d002';

export default function FileManagerPage() {
  return (
    <FilesPageClient
      testS3ConfigurationAction={testS3Configuration}
      getPresignedUploadUrlAction={getPresignedUploadUrlAction}
      createFileAction={createFile}
      getFilesAction={getFiles}
      softDeleteFileAction={softDeleteFile}
      updateFileAction={updateFile}
    />
  );
}
```

### Кросс-доменное использование: серверный враппер (опционально)

```tsx
// Пример серверной обёртки в другом домене
import 'server-only';
import { FileList } from '@/domains/catalog-files-d002';
import {
  getFiles,
  softDeleteFile
} from '@/domains/catalog-files-d002/index.server';

export function FileListBridge() {
  return (
    <FileList getFilesAction={getFiles} softDeleteFileAction={softDeleteFile} />
  );
}
```

## Обязательные UI-виджеты (каталог = виджет)

1. `ui/file-list/` — список файлов: поиск, сортировка, пагинация, мягкое удаление
2. `ui/file-details/` — карточка файла с редактированием
3. `ui/file-picker/` — выбор файла для связывания с другими доменами
4. `ui/file-uploader/` — загрузка в S3 + регистрация в БД
5. `ui/image-picker/` — выбор только изображений
6. `ui/files-page/` — собранная клиентская страница управления файлами

## Правила (важно)

- Server Actions: только в `infra/*.actions.ts`, первый рядок — `'use server'`; экспорт — только через `index.server.ts`.
- Клиент не импортирует Server Actions напрямую — только через пропсы или серверные врапперы.
- Разделение окружений: `.server.ts[x]` + `import 'server-only'`; `.client.ts[x]` + `'use client'`.
- Два индекс-файла на домен: `index.ts` (client-safe) и `index.server.ts` (server-only).
- “1 каталог = 1 виджет” в `ui/`, публичный реэкспорт — через `ui/<widget>/index.ts` и доменный `index.ts`.

_Домен служит эталоном для работы с файлами (S3) и передачи Server Actions в клиентские виджеты._
