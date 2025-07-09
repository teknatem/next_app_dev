export const DATABASE_CONFIG = {
  maxConnections: 20,
  idleTimeout: 30,
  connectionTimeout: 2000,
} as const;

export const MIGRATION_CONFIG = {
  migrationsFolder: './shared/database/migrations/sql',
  schemaPath: './shared/database/schemas',
} as const; 
