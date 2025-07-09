import 'server-only';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schemas';

// Создаем подключение к PostgreSQL
const client = postgres(process.env.POSTGRES_URL!);

// Создаем Drizzle connection с всеми схемами
export const db = drizzle(client, { schema });

// Экспортируем клиент для утилит
export { client }; 
