// ✅ SERVER-ONLY exports
import 'server-only';

// Server Actions only
export {
  getBots,
  getBot,
  createBot,
  updateBot,
  deleteBot
} from './infra/crud.actions.server';
