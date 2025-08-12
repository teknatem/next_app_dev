### AssemblyAI — краткая интеграция

- **Переменные окружения**: добавьте в `.env.local`

  ```bash
  ASSEMBLYAI_API_KEY=ваш_ключ
  ```

- **Ключевой сервис**: `domain/document-meetings-d004/lib/assemblyai.service.server.ts`

  - Методы: `uploadFile`, `startTranscription`, `getTranscription`, `waitForTranscription`, `transcribeFromUrl`, `transcribeFromStorage`, `transcribeFromS3`
  - По умолчанию: `language_code = 'ru'`, `format_text = true`, `punctuate = true`

- **Быстрый тест интеграции**:

  ```bash
  pnpm exec tsx scripts/test-assemblyai-simple.ts
  ```

- **Замечания**:
  - Ожидание результата может занять несколько минут (поллинг до завершения)
  - Для продакшена храните ключ только в переменных окружения
