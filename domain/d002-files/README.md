# catalog-files-d002 — Доменно-ориентированный UI для работы с файлами

## Структура (актуальная)

```
domains/catalog-files-d002/
├── infra/                        # ⚠️ server-only: инфраструктура
│   ├── orm.server.ts             # ORM-схемы ('server-only')
│   ├── file.repo.server.ts       # Репозиторий БД
│   ├── s3.service.server.ts      # S3-интеграции
│   ├── crud.actions.ts           # Server Actions ('use server')
│   └── test-s3.actions.ts        # Server Actions ('use server')
├── lib/                          # ✅ shared/client-safe утилиты
│   └── date-utils.shared.ts
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
├── types.shared.ts               # ✅ shared: типы и экспорт zod/enum
├── index.ts                      # ✅ client-safe barrel
├── index.server.ts               # ⚠️ server-only barrel
└── README.md
```

## Экспорт (двойной индекс)

- `index.ts` (client-safe): UI-виджеты, shared-типы/утилиты. Не содержит серверных экспортов.
- `index.server.ts` (server-only): серверный баррель — для server actions из `infra/*.actions.ts`, репозиториев и server-сервисов. Обязателен для экспорта Server Actions.

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
} from '@/domain/d002-files/index.server';
import { FilesPageClient } from '@/domain/d002-files';

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
import { FileList } from '@/domain/d002-files';
import {
  getFiles,
  softDeleteFile
} from '@/domain/d002-files/index.server';

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

- Server Actions: только в `infra/*.actions.ts`, первый рядок — `'use server'`.
- Экспорт Server Actions — только через `index.server.ts` домена. Клиент не импортирует их напрямую; передаём через props/`action`.
- Для междоменного использования передавайте Server Actions через props, `action` форм или серверные врапперы.
- Разделение окружений: `.server.ts[x]` + `import 'server-only'`; `.client.ts[x]` + `'use client'`.
- Два индекс-файла на домен: `index.ts` (client-safe) и при необходимости `index.server.ts` (server-only).
- “1 каталог = 1 виджет” в `ui/`, публичный реэкспорт — через `ui/<widget>/index.ts` и доменный `index.ts`.

_Домен служит эталоном для работы с файлами (S3) и передачи Server Actions в клиентские виджеты._
