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
export { BotListServer } from './ui/bot-list/bot-list.server';
export { BotDetailsServer } from './ui/bot-details/bot-details.server';
export { BotPickerServer } from './ui/bot-picker/bot-picker.server';
