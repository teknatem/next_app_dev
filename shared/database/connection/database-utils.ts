
/**
 * Утилиты для работы с подключением к базе данных
 */

export interface DatabaseConfig {
  url: string;
  isReplit: boolean;
  type: 'Replit Neon' | 'Local PostgreSQL';
}

/**
 * Определяет конфигурацию базы данных
 */
export function getDatabaseConfig(): DatabaseConfig {
  // Приоритет: REPLIT_DATABASE_URL > DATABASE_URL > POSTGRES_URL
  const url = process.env.REPLIT_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!url) {
    throw new Error('Database URL not found. Please set REPLIT_DATABASE_URL, DATABASE_URL or POSTGRES_URL environment variable.');
  }

  const isReplit = url.includes('neon.tech');
  const type = isReplit ? 'Replit Neon' : 'Local PostgreSQL';

  return { url, isReplit, type };
}

/**
 * Логирует информацию о подключении к базе данных
 */
export function logDatabaseConnection(config: DatabaseConfig): void {
  console.log(`[DB] Connecting to: ${config.type}`);
}

/**
 * Получает URL базы данных (backward compatibility)
 */
export function getDatabaseUrl(): string {
  return getDatabaseConfig().url;
}
