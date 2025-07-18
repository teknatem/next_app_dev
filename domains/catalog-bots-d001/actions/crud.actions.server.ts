import 'server-only';

import { ZodError } from 'zod';
import { botRepository } from '../data/bot.repo.server';
import { formBotSchema, updateBotSchema } from '../model/bots.schema';

export const botActions = {
  /**
   * Создать нового бота
   */
  async createBotAction(
    formData: FormData
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const rawData = {
        name: formData.get('name') as string,
        gender: formData.get('gender') as string,
        position: formData.get('position') as string,
        hierarchyLevel: Number(formData.get('hierarchyLevel')),
        avatarUrl: formData.get('avatarUrl') as string,
        primaryColor: formData.get('primaryColor') as string,
        role: formData.get('role') as string,
        goals: formData.get('goals') as string,
        rules: formData.get('rules') as string,
        llmProvider: formData.get('llmProvider') as string,
        llmModel: formData.get('llmModel') as string
      };

      const validatedData = formBotSchema.parse(rawData);

      // Проверка уникальности имени
      const exists = await botRepository.botExistsByName(validatedData.name);
      if (exists) {
        return {
          success: false,
          error: 'Бот с таким именем уже существует'
        };
      }

      const newBot = await botRepository.createBot(validatedData);
      return { success: true, data: newBot };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return {
          success: false,
          error: `Validation failed: ${errorDetails}`
        };
      }
      console.error('Error creating bot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create bot'
      };
    }
  },

  /**
   * Обновить бота
   */
  async updateBotAction(
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const rawData = {
        name: formData.get('name') as string,
        gender: formData.get('gender') as string,
        position: formData.get('position') as string,
        hierarchyLevel: Number(formData.get('hierarchyLevel')),
        avatarUrl: formData.get('avatarUrl') as string,
        primaryColor: formData.get('primaryColor') as string,
        role: formData.get('role') as string,
        goals: formData.get('goals') as string,
        rules: formData.get('rules') as string,
        llmProvider: formData.get('llmProvider') as string,
        llmModel: formData.get('llmModel') as string
      };

      const validatedData = updateBotSchema.parse(rawData);

      // Проверка уникальности имени (исключая текущего бота)
      if (validatedData.name) {
        const exists = await botRepository.botExistsByName(
          validatedData.name,
          id
        );
        if (exists) {
          return {
            success: false,
            error: 'Бот с таким именем уже существует'
          };
        }
      }

      const updatedBot = await botRepository.updateBot(id, validatedData);
      if (!updatedBot) {
        return { success: false, error: 'Бот не найден' };
      }

      return { success: true, data: updatedBot };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return {
          success: false,
          error: `Validation failed: ${errorDetails}`
        };
      }
      console.error('Error updating bot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update bot'
      };
    }
  },

  /**
   * Мягкое удаление бота
   */
  async softDeleteBotAction(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const deletedBot = await botRepository.softDeleteBot(id);
      if (!deletedBot) {
        return { success: false, error: 'Бот не найден' };
      }
      return { success: true, data: deletedBot };
    } catch (error) {
      console.error('Error deleting bot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete bot'
      };
    }
  },

  /**
   * Получить бота по ID
   */
  async getBotByIdAction(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const bot = await botRepository.getBotById(id);
      if (!bot) {
        return { success: false, error: 'Бот не найден' };
      }
      return { success: true, data: bot };
    } catch (error) {
      console.error('Error fetching bot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bot'
      };
    }
  },

  /**
   * Получить список ботов
   */
  async getBotsAction(options: {
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
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await botRepository.getBots(options);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching bots:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bots'
      };
    }
  },

  /**
   * Получить ботов по уровню иерархии
   */
  async getBotsByHierarchyLevelAction(
    level: number
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const bots = await botRepository.getBotsByHierarchyLevel(level);
      return { success: true, data: bots };
    } catch (error) {
      console.error('Error fetching bots by hierarchy level:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch bots by hierarchy level'
      };
    }
  },

  /**
   * Получить ботов по провайдеру LLM
   */
  async getBotsByProviderAction(
    provider: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const bots = await botRepository.getBotsByProvider(provider);
      return { success: true, data: bots };
    } catch (error) {
      console.error('Error fetching bots by provider:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch bots by provider'
      };
    }
  }
};
