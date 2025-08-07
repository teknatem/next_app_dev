import { z } from 'zod';
import { LLM_MODELS, LLM_PROVIDERS, GENDER_OPTIONS } from './enums';

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
      gender: z.enum([
        GENDER_OPTIONS.MALE,
        GENDER_OPTIONS.FEMALE,
        GENDER_OPTIONS.OTHER
      ]),
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

export { LLM_PROVIDERS, LLM_MODELS, GENDER_OPTIONS };
