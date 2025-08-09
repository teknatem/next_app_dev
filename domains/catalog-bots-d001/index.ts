// ✅ CLIENT-SAFE exports only

// Types and schemas
export type { Bot, NewBot } from './types.shared';
export {
  LLM_PROVIDERS,
  LLM_MODELS,
  GENDER_OPTIONS,
  formBotSchema
} from './types.shared';

// UI Components
export * from './ui';

// ⚠️ Не экспортируем server actions из client-safe индекса
