'use server-only';

import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import { users } from '@/shared/database/schemas/users';

export const d002Files = pgTable('d002_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),
  s3Key: varchar('s3_key', { length: 1024 }).notNull().unique(),
  url: varchar('url', { length: 2048 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  mimeType: varchar('mime_type', { length: 127 }).notNull(),
  fileSize: integer('file_size').notNull(), // size in bytes
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: uuid('deleted_by').references(() => users.id),
  metadata: text('metadata').$type<Record<string, any>>()
});

// Базовые типы для внутреннего использования в репозиториях
export type D002FileRecord = typeof d002Files.$inferSelect;
export type NewD002FileRecord = typeof d002Files.$inferInsert;
