'use server';

import { botActions } from './crud.actions.server';
import type { Bot } from '../model/bots.schema';

/**
 * Server Action to create a new bot.
 * Safe to be called from Client Components.
 */
export const createBot = async (
  formData: FormData
): Promise<{ success: boolean; data?: Bot; error?: string }> => {
  return botActions.createBotAction(formData);
};

/**
 * Server Action to update an existing bot.
 * Safe to be called from Client Components.
 */
export const updateBot = async (
  id: string,
  formData: FormData
): Promise<{ success: boolean; data?: Bot; error?: string }> => {
  return botActions.updateBotAction(id, formData);
};

/**
 * Server Action to soft-delete a bot.
 * Safe to be called from Client Components.
 */
export const deleteBot = async (
  id: string
): Promise<{ success: boolean; data?: Bot; error?: string }> => {
  return botActions.softDeleteBotAction(id);
};

/**
 * Server Action to get a bot by its ID.
 * Safe to be called from Client Components.
 */
export const getBot = async (
  id: string
): Promise<{ success: boolean; data?: Bot; error?: string }> => {
  return botActions.getBotByIdAction(id);
};

/**
 * Server Action to get a list of bots with filtering and pagination.
 * Safe to be called from Client Components.
 */
export const getBots = async (
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
): Promise<{ success: boolean; data?: any; error?: string }> => {
  return botActions.getBotsAction(options);
};
