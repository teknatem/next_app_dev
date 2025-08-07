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

// Re-export schemas and enums for client-safe usage
export { botSchema, formBotSchema, LLM_PROVIDERS, LLM_MODELS, GENDER_OPTIONS };
