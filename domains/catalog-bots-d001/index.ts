// ✅ CLIENT-SAFE exports only

// Types and schemas
export type { Bot, NewBot } from './model/bots.schema';
export { LLM_PROVIDERS, LLM_MODELS, GENDER_OPTIONS } from './model/bots.schema';

// Server Actions
export {
  createBot,
  updateBot,
  deleteBot,
  getBot,
  getBots
} from './actions/bots.actions';

// UI Components
export { BotList } from './ui/bot.list.client';
export { BotDetails } from './ui/bot.details.client';
export { BotPicker } from './ui/bot.picker.client';
