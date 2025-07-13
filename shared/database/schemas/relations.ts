import { relations } from 'drizzle-orm';

import { productionItems } from './production-items';
import { productionItemsConsumption } from './production-items-consumption';

// Отношения для productionItems
export const productionItemsRelations = relations(productionItems, ({ many }) => ({
  consumption: many(productionItemsConsumption),
}));

// Отношения для productionItemsConsumption
export const productionItemsConsumptionRelations = relations(
  productionItemsConsumption, 
  ({ one }) => ({
    item: one(productionItems, {
      fields: [productionItemsConsumption.itemId],
      references: [productionItems.id],
    }),
  })
); 
