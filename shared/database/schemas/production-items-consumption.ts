import { pgTable, uuid, text, timestamp, numeric, date } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { productionItems } from './production-items';

export const productionItemsConsumption = pgTable('production_items_consumption', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').references(() => productionItems.id).notNull(),
  itemName: text('item_name').notNull(),
  itemCode: text('item_code'),
  itemArticle: text('item_article'),
  receiptDoc: text('receipt_doc').notNull(),
  receiptDate: date('receipt_date').notNull(),
  productionDate: date('production_date').notNull(),
  quantity: numeric('quantity', { precision: 15, scale: 3 }).notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Zod схемы для валидации
export const insertProductionItemsConsumptionSchema = createInsertSchema(productionItemsConsumption);
export const selectProductionItemsConsumptionSchema = createSelectSchema(productionItemsConsumption);

// TypeScript типы
export type ProductionItemsConsumption = typeof productionItemsConsumption.$inferSelect;
export type NewProductionItemsConsumption = typeof productionItemsConsumption.$inferInsert; 
