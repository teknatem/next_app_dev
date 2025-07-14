import { config as loadEnv } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { MIGRATION_CONFIG } from '../connection/config';

// Load environment variables (.env.local takes precedence if exists)
loadEnv({ path: '.env.local' });
loadEnv();

/**
 * Унифицированная функция для получения конфигурации базы данных
 * @returns {{url: string, type: string}}
 */
function getDatabaseConfig() {
  const url =
    process.env.REPLITDATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(
      'Database URL not found. Please set REPLITDATABASE_URL, DATABASE_URL or POSTGRES_URL environment variable.'
    );
  }

  return {
    url,
    type: url.includes('neon.tech') ? 'Replit Neon' : 'Local PostgreSQL'
  };
}

/**
 * Унифицированная функция для логирования информации о подключении к базе данных
 * @param {{url: string, type: string}} dbConfig
 */
function logDatabaseConnection(dbConfig: { url: string; type: string }) {
  console.log(`[DB] Using: ${dbConfig.type}`);
}

/**
 * Применение миграций к базе данных
 */
export async function runMigrations() {
  // Используем унифицированную утилиту для получения конфигурации базы данных
  const dbConfig = getDatabaseConfig();

  const client = postgres(dbConfig.url);
  const db = drizzle(client);

  try {
    console.log('🔄 Applying database migrations...');
    logDatabaseConnection(dbConfig);

    await migrate(db, {
      migrationsFolder: MIGRATION_CONFIG.migrationsFolder
    });

    console.log('✅ Migrations applied successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Запуск миграций если файл вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}
