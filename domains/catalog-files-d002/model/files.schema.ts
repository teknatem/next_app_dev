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
import { z } from 'zod';
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

export const insertFileSchema = createInsertSchema(d002Files);
export const selectFileSchema = createSelectSchema(d002Files);

// Схема для данных из формы (с преобразованием metadata)
export const formFileSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  mimeType: z.string().min(1).max(127),
  fileSize: z.number().positive(),
  s3Key: z.string().min(1).max(1024),
  url: z.string().min(1).max(2048),
  metadata: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        throw new Error('Invalid metadata format. Must be valid JSON.');
      }
    })
});

// Схема для обновления файлов (только поля, которые можно обновлять)
export const updateFileSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  version: z.number().int().positive().optional()
});

export type File = typeof d002Files.$inferSelect;
export type NewFile = typeof d002Files.$inferInsert;
