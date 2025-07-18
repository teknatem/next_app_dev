import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { d001Bots } from '@/shared/database/schemas/catalog-bots';

export const insertBotSchema = createInsertSchema(d001Bots);
export const selectBotSchema = createSelectSchema(d001Bots);

// Схема для данных из формы создания
export const formBotSchema = z.object({
  name: z
    .string()
    .min(1, 'Имя обязательно')
    .max(255, 'Имя не может быть длиннее 255 символов'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Пол обязателен',
    invalid_type_error: 'Пол должен быть male, female или other'
  }),
  position: z
    .string()
    .min(1, 'Должность обязательна')
    .max(255, 'Должность не может быть длиннее 255 символов'),
  hierarchyLevel: z
    .number()
    .int()
    .min(1, 'Уровень иерархии должен быть не менее 1')
    .max(10, 'Уровень иерархии не может быть больше 10'),
  avatarUrl: z.string().url('Неверный формат URL').optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Цвет должен быть в формате #RRGGBB')
    .default('#3B82F6'),
  role: z
    .string()
    .min(1, 'Роль обязательна')
    .max(5000, 'Роль не может быть длиннее 5000 символов'),
  goals: z
    .string()
    .min(1, 'Цели обязательны')
    .max(5000, 'Цели не могут быть длиннее 5000 символов'),
  rules: z
    .string()
    .min(1, 'Правила обязательны')
    .max(5000, 'Правила не могут быть длиннее 5000 символов'),
  llmProvider: z
    .string()
    .min(1, 'Провайдер LLM обязателен')
    .max(100, 'Провайдер LLM не может быть длиннее 100 символов'),
  llmModel: z
    .string()
    .min(1, 'Модель LLM обязательна')
    .max(100, 'Модель LLM не может быть длиннее 100 символов')
});

// Схема для обновления бота (только поля, которые можно обновлять)
export const updateBotSchema = z.object({
  name: z
    .string()
    .min(1, 'Имя обязательно')
    .max(255, 'Имя не может быть длиннее 255 символов')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  position: z
    .string()
    .min(1, 'Должность обязательна')
    .max(255, 'Должность не может быть длиннее 255 символов')
    .optional(),
  hierarchyLevel: z
    .number()
    .int()
    .min(1, 'Уровень иерархии должен быть не менее 1')
    .max(10, 'Уровень иерархии не может быть больше 10')
    .optional(),
  avatarUrl: z.string().url('Неверный формат URL').optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Цвет должен быть в формате #RRGGBB')
    .optional(),
  role: z
    .string()
    .min(1, 'Роль обязательна')
    .max(5000, 'Роль не может быть длиннее 5000 символов')
    .optional(),
  goals: z
    .string()
    .min(1, 'Цели обязательны')
    .max(5000, 'Цели не могут быть длиннее 5000 символов')
    .optional(),
  rules: z
    .string()
    .min(1, 'Правила обязательны')
    .max(5000, 'Правила не могут быть длиннее 5000 символов')
    .optional(),
  llmProvider: z
    .string()
    .min(1, 'Провайдер LLM обязателен')
    .max(100, 'Провайдер LLM не может быть длиннее 100 символов')
    .optional(),
  llmModel: z
    .string()
    .min(1, 'Модель LLM обязательна')
    .max(100, 'Модель LLM не может быть длиннее 100 символов')
    .optional(),
  version: z.number().int().positive().optional()
});

// Типы для TypeScript
export type Bot = typeof d001Bots.$inferSelect;
export type NewBot = typeof d001Bots.$inferInsert;

// Константы для провайдеров и моделей
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
