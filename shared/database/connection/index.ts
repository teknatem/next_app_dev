import 'server-only';
import type { Pool } from '@neondatabase/serverless';
import {
  drizzle as drizzleNodePostgres,
  type NodePgDatabase
} from 'drizzle-orm/node-postgres';
import {
  drizzle as drizzlePostgresJs,
  type PostgresJsDatabase
} from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';

import * as schema from '../schemas';
import { getDatabaseConfig, logDatabaseConnection } from './database-utils';

const dbConfig = getDatabaseConfig();
logDatabaseConnection(dbConfig);

let client: Pool | Sql;
let db: NodePgDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;

// process.env.NEXT_RUNTIME === 'edge' - это переменная Next.js, которая указывает на Edge-среду
if (process.env.NEXT_RUNTIME === 'edge' || dbConfig.type === 'Replit Neon') {
  const { Pool } = require('@neondatabase/serverless');
  const { drizzle } = require('drizzle-orm/node-postgres');
  const pool = new Pool({ connectionString: dbConfig.url });
  client = pool;
  db = drizzle(pool, { schema });
} else {
  const postgres = require('postgres');
  const { drizzle } = require('drizzle-orm/postgres-js');
  const pg_client = postgres(dbConfig.url);
  client = pg_client;
  db = drizzle(pg_client, { schema });
}

export { db, client };
