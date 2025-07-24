import 'server-only';

import {
  createBot,
  updateBot,
  deleteBot,
  getBot,
  getBots
} from '../actions/crud.actions.server';
import { botRepository } from '../data/bot.repo.server';
import type { NewBot } from '../types.shared';

export const botCrudServer = {
  /**
   * Создать нового бота
   */
  async createBot(formData: FormData) {
    const data: NewBot = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      llmProvider: formData.get('llmProvider') as string,
      llmModel: formData.get('llmModel') as string,
      hierarchyLevel: Number(formData.get('hierarchyLevel')),
      primaryColor: formData.get('primaryColor') as string,
      role: formData.get('role') as string,
      goals: formData.get('goals') as string,
      rules: formData.get('rules') as string
    };
    return await createBot(data);
  },

  /**
   * Обновить бота
   */
  async updateBot(id: string, formData: FormData) {
    const data: Partial<NewBot> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        if (
          [
            'hierarchyLevel',
            'temperature',
            'topP',
            'maxTokens',
            'frequencyPenalty',
            'presencePenalty'
          ].includes(key)
        ) {
          (data as any)[key] = Number(value);
        } else {
          (data as any)[key] = value;
        }
      }
    }
    return await updateBot(id, data);
  },

  /**
   * Мягкое удаление бота
   */
  async deleteBot(id: string) {
    return await deleteBot(id);
  },

  /**
   * Получить бота по ID
   */
  async getBot(id: string) {
    return await getBot(id);
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
    return await getBots(options);
  },

  /**
   * Получить ботов по уровню иерархии
   */
  async getBotsByHierarchyLevel(level: number) {
    return await botRepository.getBotsByHierarchyLevel(level);
  },

  /**
   * Получить ботов по провайдеру LLM
   */
  async getBotsByProvider(provider: string) {
    return await botRepository.getBotsByProvider(provider);
  }
};
