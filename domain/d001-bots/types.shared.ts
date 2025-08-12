import { z } from 'zod';
import {
  botSchema,
  formBotSchema,
  LLM_PROVIDERS,
  LLM_MODELS,
  GENDER_OPTIONS
} from './model/schemas.shared';

// TypeScript types derived from the base schema
export type Bot = z.infer<typeof botSchema>;
export type NewBot = z.infer<typeof formBotSchema>;

// Shared types for list/sort params
export type SortOrder = 'asc' | 'desc';
export type BotSortField =
  | 'name'
  | 'position'
  | 'hierarchyLevel'
  | 'llmProvider'
  | 'createdAt';

export interface GetBotsParams {
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
  search?: string;
  sortBy?: BotSortField;
  sortOrder?: SortOrder;
}

export interface UpdateBotParams {
  id: string;
  data: Partial<NewBot>;
  version: number; // optimistic concurrency control
}

export interface DeleteBotParams {
  id: string;
  version: number; // optimistic concurrency control
}

// Re-export schemas and enums for client-safe usage
export { botSchema, formBotSchema, LLM_PROVIDERS, LLM_MODELS, GENDER_OPTIONS };
