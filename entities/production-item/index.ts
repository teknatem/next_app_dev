// Model exports (Client & Server safe)
export type {
  ProductionItem,
  CreateProductionItem,
  UpdateProductionItem,
  ProductionItemType
} from './model/types';

export {
  ProductionItemSchema,
  CreateProductionItemSchema,
  UpdateProductionItemSchema,
  PRODUCTION_ITEM_TYPES,
  getProductionItemTypeLabel,
  getProductionItemTypeColor
} from './model/types';

// UI exports (Client safe)
export { ProductionItemCard } from './ui/production-item-card';

// NOTE: API exports are server-only, import directly:
// import { ProductionItemApi } from '@/entities/production-item/api/production-item.api'; 
