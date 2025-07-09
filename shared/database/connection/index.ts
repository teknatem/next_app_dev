import 'server-only';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schemas';
import { getDatabaseConfig, logDatabaseConnection } from './database-utils';

// Получаем конфигурацию базы данных
const dbConfig = getDatabaseConfig();

// Логируем подключение
logDatabaseConnection(dbConfig);

// Создаем подключение к PostgreSQL
const client = postgres(dbConfig.url);

// Создаем Drizzle connection с всеми схемами
export const db = drizzle(client, { schema });

// Экспортируем клиент для утилит
export { client };