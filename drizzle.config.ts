import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Используем унифицированную утилиту для получения URL базы данных
import { getDatabaseUrl } from './shared/database/connection/database-utils';

const databaseUrl = getDatabaseUrl();

export default defineConfig({
  schema: ['./shared/database/schemas/*', './domains/**/orm.server.ts'],
  out: './shared/database/migrations/sql',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl
  },
  verbose: true,
  strict: true
});
