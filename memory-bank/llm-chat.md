# LLM Chat: Concept & Implementation Plan

## 🌟 Goal

Интегрировать в приложение чат-окно на основе LLM, который:

1. Принимает **контекст** из выбранных пользователем таблиц, графиков, страниц.
2. Может инициировать **функциональные вызовы** внутри приложения (openReport, setReportParams, getReport и т.д.), получая их результаты обратно в диалог.

## 🎯 Key Principles

- **FSD-совместимость** – код распределяется по слоям (widgets, shared, server, entities).
- **Server/Client Separation** – server-only logic (LLM proxy, function handlers) остаётся в server-папке.
- **Минимализм** – используем лёгкие библиотеки (zustand <2 KB, zod, SSE/WS), без избыточного boilerplate.
- **Безопасность** – авторизация, rate-limit, аудит вызовов функций.

## 🏗️ Architecture Overview

```
sequenceDiagram
    participant UI as ChatWindow (widget)
    participant Store as zustand stores
    participant Collector as Context-aggregator
    participant API as /api/llm (Edge)
    participant LLM as OpenAI (function-calling)
    participant Tools as server/llm-tools/*
    UI->>Store: update messages / selection
    UI->>Collector: request context JSON
    Collector-->>UI: compacted context
    UI->>API: {messages, context}
    API->>LLM: ChatCompletion(functions[])
    LLM-->>API: function_call(openReport)
    API->>Tools: dispatch handler
    Tools-->>API: result JSON
    API-->>LLM: function result as message
    LLM-->>API: assistant response
    API-->>UI: SSE stream
    UI->>Store: append messages
    Store-->>Any Widget: event (openReport)
```

## 📚 Main Components

1. **widgets/llm-chat/** – React-компоненты окна чата.
2. **shared/store/** – zustand сто́ры:
   - `llm-chat.ts` – сообщения, статус запроса.
   - `context-selection.ts` – выбранные табы/графики.
3. **shared/lib/context/** – `collectContext()` собиратель контекста → JSON.
4. **app/api/llm/route.ts** – Edge endpoint (SSE) обёртка над OpenAI.
5. **server/llm-tools/** – файлы-инструменты (`openReport.ts`, `setReportParams.ts` …) с `descriptor` + `handler`.
6. **shared/lib/llm/** – клиент-SDK для вызова /api/llm и обработки stream.

## 🚦 Implementation Stages

| Stage | Description                                                      | Outcome                                     |
| ----- | ---------------------------------------------------------------- | ------------------------------------------- |
| 0     | **Clarify requirements** (LLM provider, security, history)       | Чёткие answers на 5 вопросов из Concept doc |
| 1     | **Infrastructure** – zustand stores, ChatWindow UI (mock stream) | Рабочий локальный чат без LLM               |
| 2     | **Context aggregator** – hooks в таблицах/графиках → JSON        | Контекст передаётся в чат                   |
| 3     | **LLM API** – /api/llm + OpenAI stream                           | Модель отвечает в чат                       |
| 4     | **Function calling** – descriptor registry + dispatch            | LLM вызывает openReport()                   |
| 5     | **UI integration** – реакция виджетов на вызовы                  | Чат открывает отчёты                        |
| 6     | **UX polish** – virtualized list, markdown, history persist      | Готовый пользовательский опыт               |
| 7     | **Security & Monitoring** – rate-limit, audit                    | Prod-ready                                  |

## ⏭️ Next Checkpoint

После завершения текущего Sprint 2 (Database Integration) перейти к **Stage 0** выше и ответить на открытые вопросы.
