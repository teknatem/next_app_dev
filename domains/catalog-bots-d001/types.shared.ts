import { z } from 'zod';

// Base schema for Bot, usable on both client and server.
// It does not depend on database-specific schemas.
export const botSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int(),
  name: z.string().max(255),
  gender: z.string().max(50),
  position: z.string().max(255),
  hierarchyLevel: z.number().int(),
  avatarUrl: z.string().url().nullable().optional(),
  primaryColor: z
    .string()
    .length(7)
    .regex(/^#[0-9a-f]{6}$/i),
  role: z.string(),
  goals: z.string(),
  rules: z.string(),
  llmProvider: z.string().max(100),
  llmModel: z.string().max(100),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid().nullable().optional(),
  updatedBy: z.string().uuid().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  deletedBy: z.string().uuid().nullable().optional()
});

export const formBotSchema = botSchema
  .omit({
    id: true,
    version: true,
    isDeleted: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    deletedAt: true,
    deletedBy: true
  })
  .merge(
    z.object({
      name: z.string().min(1, 'Имя обязательно'),
      gender: z.enum(['male', 'female', 'other']),
      position: z.string().min(1, 'Должность обязательна'),
      hierarchyLevel: z
        .number()
        .min(1, 'Уровень иерархии должен быть не менее 1'),
      primaryColor: z.string().default('#3B82F6'),
      role: z.string().min(1, 'Роль обязательна'),
      goals: z.string().min(1, 'Цели обязательны'),
      rules: z.string().min(1, 'Правила обязательны'),
      llmProvider: z.string().min(1, 'Провайдер LLM обязателен'),
      llmModel: z.string().min(1, 'Модель LLM обязательна')
    })
  );

// TypeScript types derived from the base schema
export type Bot = z.infer<typeof botSchema>;
export type NewBot = z.infer<typeof formBotSchema>;

// Constants for providers and models
export const LLM_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  YANDEX: 'yandex',
  GOOGLE: 'google',
  MISTRAL: 'mistral'
} as const;

export const LLM_MODELS = {
  // OpenAI
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',

  // Anthropic
  CLAUDE_3_OPUS: 'claude-3-opus',
  CLAUDE_3_SONNET: 'claude-3-sonnet',
  CLAUDE_3_HAIKU: 'claude-3-haiku',

  // Yandex
  YANDEX_GPT: 'yandex-gpt',
  YANDEX_GPT_LITE: 'yandex-gpt-lite',

  // Google
  GEMINI_PRO: 'gemini-pro',
  GEMINI_FLASH: 'gemini-flash',

  // Mistral
  MISTRAL_LARGE: 'mistral-large',
  MISTRAL_MEDIUM: 'mistral-medium',
  MISTRAL_SMALL: 'mistral-small'
} as const;

export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const;
