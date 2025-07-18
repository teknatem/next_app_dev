import 'server-only';

import { botActions } from '../actions/crud.actions.server';

export const botCrudServer = {
  /**
   * Создать нового бота
   */
  async createBot(formData: FormData) {
    return await botActions.createBotAction(formData);
  },

  /**
   * Обновить бота
   */
  async updateBot(id: string, formData: FormData) {
    return await botActions.updateBotAction(id, formData);
  },

  /**
   * Мягкое удаление бота
   */
  async deleteBot(id: string) {
    return await botActions.softDeleteBotAction(id);
  },

  /**
   * Получить бота по ID
   */
  async getBot(id: string) {
    return await botActions.getBotByIdAction(id);
  },

  /**
   * Получить список ботов
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
  ) {
    return await botActions.getBotsAction(options);
  },

  /**
   * Получить ботов по уровню иерархии
   */
  async getBotsByHierarchyLevel(level: number) {
    return await botActions.getBotsByHierarchyLevelAction(level);
  },

  /**
   * Получить ботов по провайдеру LLM
   */
  async getBotsByProvider(provider: string) {
    return await botActions.getBotsByProviderAction(provider);
  }
};
