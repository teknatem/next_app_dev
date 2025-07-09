import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const productionItems = pgTable('production_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  article: text('article'),
  type: text('type', { 
    enum: ['material', 'semi_finished', 'finished', 'service'] 
  }).notNull().default('material'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Zod схемы для валидации
export const insertProductionItemSchema = createInsertSchema(productionItems);
export const selectProductionItemSchema = createSelectSchema(productionItems);

// TypeScript типы
export type ProductionItem = typeof productionItems.$inferSelect;
export type NewProductionItem = typeof productionItems.$inferInsert; 
