import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
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
    .notNull()
});

export const insertFileSchema = createInsertSchema(files);
export const selectFileSchema = createSelectSchema(files);

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
