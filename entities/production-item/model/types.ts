import { z } from 'zod';

/**
 * Типы производственных материалов
 */
export const PRODUCTION_ITEM_TYPES = {
  material: 'Материал',
  semi_finished: 'Полуфабрикат', 
  finished: 'Готовое изделие',
  service: 'Услуга'
} as const;

export type ProductionItemType = keyof typeof PRODUCTION_ITEM_TYPES;

/**
 * Схема валидации Production Item
 */
export const ProductionItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Название обязательно'),
  code: z.string().min(1, 'Код обязателен'),
  article: z.string().nullable(),
  type: z.enum(['material', 'semi_finished', 'finished', 'service']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductionItemSchema = ProductionItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductionItemSchema = CreateProductionItemSchema.partial();

/**
 * TypeScript типы
 */
export type ProductionItem = z.infer<typeof ProductionItemSchema>;
export type CreateProductionItem = z.infer<typeof CreateProductionItemSchema>;
export type UpdateProductionItem = z.infer<typeof UpdateProductionItemSchema>;

/**
 * Утилиты для работы с типами
 */
export const getProductionItemTypeLabel = (type: ProductionItemType): string => {
  return PRODUCTION_ITEM_TYPES[type];
};

export const getProductionItemTypeColor = (type: ProductionItemType): string => {
  const colors = {
    material: 'bg-blue-100 text-blue-800',
    semi_finished: 'bg-yellow-100 text-yellow-800', 
    finished: 'bg-green-100 text-green-800',
    service: 'bg-purple-100 text-purple-800'
  };
  return colors[type];
}; 
