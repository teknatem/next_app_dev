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
export { BotList } from './ui/bot.list.client';
export { BotDetails } from './ui/bot.details.client';
export { BotPicker } from './ui/bot.picker.client';

// Client-safe Server Actions
export {
  getBots,
  getBot,
  createBot,
  updateBot,
  deleteBot
} from './actions/crud.actions.server';
