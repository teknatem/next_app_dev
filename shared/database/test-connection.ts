import { db } from './connection';
import {
  getDatabaseConfig,
  logDatabaseConnection
} from './connection/database-utils';

export async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');

    // Показываем конфигурацию базы данных
    const dbConfig = getDatabaseConfig();
    logDatabaseConnection(dbConfig);

    // Простой тест подключения
    const result = await db.execute('SELECT NOW() as current_time');

    console.log('✅ Database connection successful');
    if (Array.isArray(result) && result.length > 0) {
      console.log('⏰ Server time:', (result[0] as any)?.current_time);
    }

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Запуск теста если файл вызван напрямую
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
