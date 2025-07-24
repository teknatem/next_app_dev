// ✅ SERVER-ONLY exports
import 'server-only';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { d001Bots } from './orm.server';

// All client-safe exports from the main index file
export * from './index';

// Server-specific exports
export { d001Bots } from './orm.server';
export const insertBotSchema = createInsertSchema(d001Bots);
export const selectBotSchema = createSelectSchema(d001Bots);
