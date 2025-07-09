import 'server-only';
import { db } from '@/shared/database/connection';
import { productionItems } from '@/shared/database/schemas';
import { BaseCrudService, type CrudOptions, type PaginatedResult } from '@/shared/database/services';
import { eq, ilike, or, count } from 'drizzle-orm';
import type { ProductionItem, CreateProductionItem, UpdateProductionItem } from '../model/types';

/**
 * API для работы с Production Items
 */
export class ProductionItemApi {
  /**
   * Получить все производственные позиции с пагинацией
   */
  static async findMany(options: CrudOptions = {}): Promise<ProductionItem[]> {
    return BaseCrudService.findMany<ProductionItem>(productionItems, options);
  }

  /**
   * Получить производственные позиции с пагинацией и подсчетом
   */
  static async findManyWithCount(options: CrudOptions = {}): Promise<PaginatedResult<ProductionItem>> {
    return BaseCrudService.findManyWithCount<ProductionItem>(productionItems, options);
  }

  /**
   * Поиск по названию, коду или артикулу
   */
  static async search(query: string, options: CrudOptions = {}): Promise<ProductionItem[]> {
    const { limit = 50, offset = 0 } = options;
    
    return db
      .select()
      .from(productionItems)
      .where(
        or(
          ilike(productionItems.name, `%${query}%`),
          ilike(productionItems.code, `%${query}%`),
          ilike(productionItems.article, `%${query}%`)
        )
      )
      .limit(limit)
      .offset(offset);
  }

  /**
   * Получить позицию по ID
   */
  static async findById(id: string): Promise<ProductionItem | null> {
    return BaseCrudService.findById<ProductionItem>(productionItems, id);
  }

  /**
   * Получить позицию по коду
   */
  static async findByCode(code: string): Promise<ProductionItem | null> {
    const results = await db
      .select()
      .from(productionItems)
      .where(eq(productionItems.code, code))
      .limit(1);
    
    return results[0] || null;
  }

  /**
   * Создать новую позицию
   */
  static async create(data: CreateProductionItem): Promise<ProductionItem> {
    return BaseCrudService.create<ProductionItem>(productionItems, data);
  }

  /**
   * Обновить позицию
   */
  static async update(id: string, data: UpdateProductionItem): Promise<ProductionItem | null> {
    return BaseCrudService.update<ProductionItem>(productionItems, id, data);
  }

  /**
   * Удалить позицию
   */
  static async delete(id: string): Promise<boolean> {
    return BaseCrudService.delete(productionItems, id);
  }

  /**
   * Получить количество позиций по типу
   */
  static async countByType(type: string): Promise<number> {
    const results = await db
      .select({ count: count() })
      .from(productionItems)
      .where(eq(productionItems.type, type as any));
    
    return results[0].count;
  }

  /**
   * Проверить существование кода (для валидации уникальности)
   */
  static async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    const results = await db
      .select({ count: count().as('count') })
      .from(productionItems)
      .where(eq(productionItems.code, code));

    return results[0].count > 0;
  }
} 
