import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { MIGRATION_CONFIG } from '../connection/config';

/**
 * Применение миграций к базе данных
 */
export async function runMigrations() {
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  try {
    console.log('🔄 Applying database migrations...');
    
    await migrate(db, {
      migrationsFolder: MIGRATION_CONFIG.migrationsFolder,
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
if (require.main === module) {
  runMigrations().catch(console.error);
} 
