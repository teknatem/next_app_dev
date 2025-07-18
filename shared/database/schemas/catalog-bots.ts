import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const d001Bots = pgTable('d001_bots', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),

  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 50 }).notNull(), // 'male', 'female', 'other'
  position: varchar('position', { length: 255 }).notNull(),
  hierarchyLevel: integer('hierarchy_level').notNull().default(1),

  // Visual Identity
  avatarUrl: varchar('avatar_url', { length: 2048 }),
  primaryColor: varchar('primary_color', { length: 7 })
    .notNull()
    .default('#3B82F6'), // Hex color

  // AI Configuration
  role: text('role').notNull(), // Role description for Prompt
  goals: text('goals').notNull(), // Goals description for Prompt
  rules: text('rules').notNull(), // Rules description for Prompt
  llmProvider: varchar('llm_provider', { length: 100 }).notNull(), // 'openai', 'anthropic', 'yandex', etc.
  llmModel: varchar('llm_model', { length: 100 }).notNull(), // 'gpt-4', 'claude-3', etc.

  // System Fields
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
  deletedBy: uuid('deleted_by').references(() => users.id)
});

export type Bot = typeof d001Bots.$inferSelect;
export type NewBot = typeof d001Bots.$inferInsert;
