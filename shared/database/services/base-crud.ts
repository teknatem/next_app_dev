import { eq, count, desc, asc } from 'drizzle-orm';
import { db } from '../connection';

/**
 * Базовые типы для CRUD операций
 */
export interface CrudOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'asc' | 'desc';
  orderColumn?: string;
}

/**
 * Результат с пагинацией
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

/**
 * Базовые CRUD функции для работы с таблицами
 */
export class BaseCrudService {
  /**
   * Получить записи с пагинацией
   */
  static async findMany<T>(
    table: any,
    options: CrudOptions = {}
  ): Promise<T[]> {
    const { limit = 50, offset = 0, orderBy = 'desc', orderColumn = 'createdAt' } = options;
    
    let query = db.select().from(table);
    
    if (orderColumn && table[orderColumn]) {
      const column = table[orderColumn];
      if (orderBy === 'asc') {
        query = query.orderBy(asc(column)) as any;
      } else {
        query = query.orderBy(desc(column)) as any;
      }
    }
    
    return query.limit(limit).offset(offset);
  }

  /**
   * Получить запись по ID
   */
  static async findById<T>(table: any, id: string): Promise<T | null> {
    const results = await db
      .select()
      .from(table)
      .where(eq(table.id, id))
      .limit(1);
    
    return (results[0] as T) || null;
  }

  /**
   * Создать новую запись
   */
  static async create<T>(table: any, data: any): Promise<T> {
    const results = await db
      .insert(table)
      .values(data)
      .returning();
    
    return results[0] as T;
  }

  /**
   * Обновить запись
   */
  static async update<T>(table: any, id: string, data: any): Promise<T | null> {
    const results = await db
      .update(table)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(table.id, id))
      .returning();
    
    return (results[0] as T) || null;
  }

  /**
   * Удалить запись
   */
  static async delete(table: any, id: string): Promise<boolean> {
    const results = await db
      .delete(table)
      .where(eq(table.id, id))
      .returning();
    
    return results.length > 0;
  }

  /**
   * Подсчитать общее количество записей
   */
  static async count(table: any): Promise<number> {
    const results = await db
      .select({ count: count() })
      .from(table);
    
    return results[0].count;
  }

  /**
   * Получить данные с пагинацией включая общее количество
   */
  static async findManyWithCount<T>(
    table: any,
    options: CrudOptions = {}
  ): Promise<PaginatedResult<T>> {
    const [data, totalCount] = await Promise.all([
      this.findMany<T>(table, options),
      this.count(table)
    ]);

    const { limit = 50, offset = 0 } = options;
    const hasMore = offset + limit < totalCount;

    return {
      data,
      total: totalCount,
      hasMore
    };
  }
} 
