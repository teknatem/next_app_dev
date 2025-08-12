'use server';

import { ZodError } from 'zod';
import { botRepository } from './bot.repo.server';
import {
  formBotSchema,
  NewBot,
  UpdateBotParams,
  DeleteBotParams,
  GetBotsParams
} from '../types.shared';
import { updateBotSchema } from '../model/schemas.shared';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/lib/auth.server';

/**
 * Создать нового бота
 */
export async function createBot(
  data: NewBot
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const validatedData = formBotSchema.parse(data);

    const exists = await botRepository.botExistsByName(validatedData.name);
    if (exists) {
      return {
        success: false,
        error: 'Бот с таким именем уже существует'
      };
    }

    const newBot = await botRepository.createBot({
      ...validatedData,
      createdBy: userId ?? undefined,
      updatedBy: userId ?? undefined
    });
    revalidatePath('/bots');
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
}

/**
 * Обновить бота
 */
export async function updateBot(
  params: UpdateBotParams
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const validatedData = updateBotSchema.parse(params.data);

    if (validatedData.name) {
      const exists = await botRepository.botExistsByName(
        validatedData.name,
        params.id
      );
      if (exists) {
        return {
          success: false,
          error: 'Бот с таким именем уже существует'
        };
      }
    }

    const updatedBot = await botRepository.updateBot(
      params.id,
      { ...validatedData, updatedBy: userId ?? undefined },
      params.version
    );
    if (!updatedBot) {
      return { success: false, error: 'Бот не найден' };
    }

    revalidatePath('/bots');
    revalidatePath(`/bots/${params.id}`);
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
}

/**
 * Мягкое удаление бота
 */
export async function deleteBot(
  params: DeleteBotParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const deletedBot = await botRepository.softDeleteBot(
      params.id,
      params.version
    );
    if (!deletedBot) {
      return { success: false, error: 'Бот не найден' };
    }
    revalidatePath('/bots');
    return { success: true };
  } catch (error) {
    console.error('Error deleting bot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete bot'
    };
  }
}

/**
 * Получить бота по ID
 */
export async function getBot(
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
}

/**
 * Получить список ботов
 */
export async function getBots(
  options: GetBotsParams
): Promise<{ success: boolean; data?: any; error?: string }> {
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
}
