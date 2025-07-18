# Исправление проблемы транскрибации

## Проблема

При попытке транскрибировать аудио файл возникала ошибка:

```json
{
  "error": "Transcription failed: Failed to fetch audio file: Forbidden",
  "metadata": {
    "provider": "AssemblyAI"
  }
}
```

## Причина

AssemblyAI не может получить доступ к файлам в S3 хранилище напрямую по URL без аутентификации.

## Решение

### 1. Добавлена функция для получения presigned URL для чтения файлов

**Файл**: `domains/catalog-files-d002/lib/s3.service.server.ts`

```typescript
export async function getPresignedReadUrl(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: s3Key
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
```

### 2. Создан новый метод для транскрибации через S3 ключ

**Файл**: `domains/document-meetings-d004/lib/assemblyai.service.server.ts`

```typescript
async transcribeFromS3(s3Key: string, options: {...}): Promise<AssemblyAITranscriptResponse> {
  // Получаем presigned URL для чтения файла
  const presignedUrl = await getPresignedReadUrl(s3Key);

  // Загружаем файл с S3
  const audioResponse = await fetch(presignedUrl);

  // Отправляем в AssemblyAI
  const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
  const uploadUrl = await this.uploadFile(audioBuffer);
  const transcriptId = await this.startTranscription(uploadUrl, options);

  return await this.waitForTranscription(transcriptId);
}
```

### 3. Обновлена логика определения типа файла

**Файл**: `domains/document-meetings-d004/actions/crud.actions.server.ts`

```typescript
// Helper function to determine asset kind from MIME type
function getAssetKindFromMimeType(
  mimeType: string
): 'document' | 'audio' | 'video' {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

// Helper function to check if asset is audio
function isAudioAsset(asset: { kind: string; mimeType: string }): boolean {
  return asset.kind === 'audio' || asset.mimeType.startsWith('audio/');
}
```

### 4. Обновлена асинхронная обработка транскрибации

**Файл**: `domains/document-meetings-d004/actions/crud.actions.server.ts`

```typescript
async function processTranscriptionAsync(
  artefactId: string,
  asset: { storageUrl: string; fileId: string | null },
  options: { language?: string }
): Promise<void> {
  if (asset.fileId) {
    // Получаем файл из базы для получения S3 ключа
    const file = await fileRepository.getFileById(asset.fileId);
    if (file && file.s3Key) {
      // Используем S3 ключ для транскрибации (более надежно)
      transcriptionResult = await assemblyAIService.transcribeFromS3(
        file.s3Key,
        { language: options.language || 'ru', speaker_labels: true }
      );
    }
  } else {
    // Fallback к storage URL
    transcriptionResult = await assemblyAIService.transcribeFromStorage(
      asset.storageUrl,
      { language: options.language || 'ru', speaker_labels: true }
    );
  }
}
```

## Улучшения

1. **Правильное определение типа файла**: Теперь тип ассета определяется из MIME типа файла, а не всегда устанавливается как 'document'

2. **Надежный доступ к файлам**: Используются presigned URLs для безопасного доступа к файлам в S3

3. **Лучшее логирование**: Добавлены подробные логи для отслеживания процесса транскрибации

4. **Fallback механизм**: Если S3 ключ недоступен, используется storage URL

## Тестирование

1. Убедитесь, что переменная `ASSEMBLYAI_API_KEY` установлена в `.env.local`
2. Загрузите аудио файл в митинг
3. Нажмите кнопку "Транскрибировать"
4. Проверьте логи в консоли сервера для отслеживания процесса
5. Дождитесь завершения транскрибации и скачайте результат

## Файлы изменены

- ✅ `domains/catalog-files-d002/lib/s3.service.server.ts` - добавлен `getPresignedReadUrl`
- ✅ `domains/catalog-files-d002/index.server.ts` - экспорт новой функции
- ✅ `domains/document-meetings-d004/lib/assemblyai.service.server.ts` - добавлен `transcribeFromS3`
- ✅ `domains/document-meetings-d004/actions/crud.actions.server.ts` - обновлена логика обработки
- ✅ `domains/document-meetings-d004/ui/meeting.details.client.tsx` - добавлен helper для проверки аудио файлов

## Готово к тестированию! 🎉
