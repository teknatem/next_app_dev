// ✅ SERVER-ONLY exports
import 'server-only';

// Server Actions only
export {
  getBots,
  getBot,
  createBot,
  updateBot,
  deleteBot
} from './actions/crud.actions.server';
