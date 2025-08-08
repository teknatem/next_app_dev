// ✅ SERVER-ONLY exports
import 'server-only';

// Server Actions only
export {
  getBots,
  getBot,
  createBot,
  updateBot,
  deleteBot
} from './infra/crud.actions';

// Server UI wrappers (RSC)
export { BotListServer } from './ui/bot.list.server';
export { BotDetailsServer } from './ui/bot.details.server';
export { BotPickerServer } from './ui/bot.picker.server';
