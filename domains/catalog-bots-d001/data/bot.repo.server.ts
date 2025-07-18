import 'server-only';

import { eq, and, or, desc, asc, like, sql } from 'drizzle-orm';
import { db } from '@/shared/database/connection';
import { d001Bots } from '@/shared/database/schemas/catalog-bots';
import type { Bot, NewBot } from '../model/bots.schema';

export const botRepository = {
  /**
   * Создать нового бота
   */
  async createBot(
    data: Omit<NewBot, 'id' | 'version' | 'createdAt' | 'updatedAt'>
  ): Promise<Bot> {
    const [newBot] = await db
      .insert(d001Bots)
      .values({
        ...data,
        version: 0
      })
      .returning();

    return newBot;
  },

  /**
   * Обновить бота
   */
  async updateBot(id: string, data: Partial<NewBot>): Promise<Bot | null> {
    const [updatedBot] = await db
      .update(d001Bots)
      .set({
        ...data,
        version: sql`${d001Bots.version} + 1`,
        updatedAt: new Date()
      })
      .where(eq(d001Bots.id, id))
      .returning();

    return updatedBot || null;
  },

  /**
   * Мягкое удаление бота
   */
  async softDeleteBot(id: string): Promise<Bot | null> {
    const [deletedBot] = await db
      .update(d001Bots)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
        version: sql`${d001Bots.version} + 1`
      })
      .where(eq(d001Bots.id, id))
      .returning();

    return deletedBot || null;
  },

  /**
   * Получить бота по ID
   */
  async getBotById(id: string): Promise<Bot | null> {
    const [bot] = await db.select().from(d001Bots).where(eq(d001Bots.id, id));

    return bot || null;
  },

  /**
   * Получить список ботов с фильтрацией и пагинацией
   */
  async getBots(
    options: {
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
      search?: string;
      sortBy?:
        | 'name'
        | 'position'
        | 'hierarchyLevel'
        | 'llmProvider'
        | 'createdAt';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ bots: Bot[]; total: number }> {
    const {
      limit = 50,
      offset = 0,
      includeDeleted = false,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Базовые условия
    const conditions = [];

    if (!includeDeleted) {
      conditions.push(eq(d001Bots.isDeleted, false));
    }

    // Поиск по имени, должности или провайдеру
    if (search) {
      const searchCondition = or(
        like(d001Bots.name, `%${search}%`),
        like(d001Bots.position, `%${search}%`),
        like(d001Bots.llmProvider, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Получение общего количества
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(d001Bots)
      .where(whereClause);

    // Получение данных с сортировкой
    const sortColumn = d001Bots[sortBy];
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const bots = await db
      .select()
      .from(d001Bots)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return {
      bots,
      total: Number(count)
    };
  },

  /**
   * Получить ботов по уровню иерархии
   */
  async getBotsByHierarchyLevel(level: number): Promise<Bot[]> {
    return await db
      .select()
      .from(d001Bots)
      .where(
        and(eq(d001Bots.hierarchyLevel, level), eq(d001Bots.isDeleted, false))
      )
      .orderBy(asc(d001Bots.name));
  },

  /**
   * Получить ботов по провайдеру LLM
   */
  async getBotsByProvider(provider: string): Promise<Bot[]> {
    return await db
      .select()
      .from(d001Bots)
      .where(
        and(eq(d001Bots.llmProvider, provider), eq(d001Bots.isDeleted, false))
      )
      .orderBy(asc(d001Bots.name));
  },

  /**
   * Проверить существование бота по имени
   */
  async botExistsByName(name: string, excludeId?: string): Promise<boolean> {
    const conditions = [eq(d001Bots.name, name), eq(d001Bots.isDeleted, false)];

    if (excludeId) {
      conditions.push(sql`${d001Bots.id} != ${excludeId}`);
    }

    const [result] = await db
      .select({ id: d001Bots.id })
      .from(d001Bots)
      .where(and(...conditions))
      .limit(1);

    return !!result;
  }
};
