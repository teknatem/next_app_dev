import 'server-only';

// ⚠️ SERVER-ONLY exports

// Types and schemas
export type { Bot, NewBot } from './model/bots.schema';
export {
  insertBotSchema,
  selectBotSchema,
  formBotSchema,
  updateBotSchema,
  LLM_PROVIDERS,
  LLM_MODELS,
  GENDER_OPTIONS
} from './model/bots.schema';

// Server data layer
export { botRepository } from './data/bot.repo.server';

// Server actions
export { botActions } from './actions/crud.actions.server';

// Server features
export { botCrudServer } from './features/crud.server';
