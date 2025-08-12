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

// Server UI widgets (RSC)
export { BotListServer } from './ui/bot-list/bot-list.server';
export { BotDetailsWidget } from './ui/bot-details/widget.server';
export { BotPickerServer } from './ui/bot-picker/bot-picker.server';
