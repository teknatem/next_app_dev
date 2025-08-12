import { z } from 'zod';
import { LLM_MODELS, LLM_PROVIDERS, GENDER_OPTIONS } from './enums.shared';

// Map available models by provider to validate compatibility
const MODELS_BY_PROVIDER: Record<
  keyof typeof LLM_PROVIDERS,
  Array<(typeof LLM_MODELS)[keyof typeof LLM_MODELS]>
> = {
  OPENAI: [LLM_MODELS.GPT_4, LLM_MODELS.GPT_4_TURBO, LLM_MODELS.GPT_3_5_TURBO],
  ANTHROPIC: [
    LLM_MODELS.CLAUDE_3_OPUS,
    LLM_MODELS.CLAUDE_3_SONNET,
    LLM_MODELS.CLAUDE_3_HAIKU
  ],
  YANDEX: [LLM_MODELS.YANDEX_GPT, LLM_MODELS.YANDEX_GPT_LITE],
  GOOGLE: [LLM_MODELS.GEMINI_PRO, LLM_MODELS.GEMINI_FLASH],
  MISTRAL: [
    LLM_MODELS.MISTRAL_LARGE,
    LLM_MODELS.MISTRAL_MEDIUM,
    LLM_MODELS.MISTRAL_SMALL
  ]
};

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
  llmProvider: z
    .enum([
      LLM_PROVIDERS.OPENAI,
      LLM_PROVIDERS.ANTHROPIC,
      LLM_PROVIDERS.YANDEX,
      LLM_PROVIDERS.GOOGLE,
      LLM_PROVIDERS.MISTRAL
    ])
    .or(z.string().max(100)),
  llmModel: z
    .enum([
      LLM_MODELS.GPT_4,
      LLM_MODELS.GPT_4_TURBO,
      LLM_MODELS.GPT_3_5_TURBO,
      LLM_MODELS.CLAUDE_3_OPUS,
      LLM_MODELS.CLAUDE_3_SONNET,
      LLM_MODELS.CLAUDE_3_HAIKU,
      LLM_MODELS.YANDEX_GPT,
      LLM_MODELS.YANDEX_GPT_LITE,
      LLM_MODELS.GEMINI_PRO,
      LLM_MODELS.GEMINI_FLASH,
      LLM_MODELS.MISTRAL_LARGE,
      LLM_MODELS.MISTRAL_MEDIUM,
      LLM_MODELS.MISTRAL_SMALL
    ])
    .or(z.string().max(100)),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid().nullable().optional(),
  updatedBy: z.string().uuid().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  deletedBy: z.string().uuid().nullable().optional()
});

const formBotFormFields = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  gender: z.enum([
    GENDER_OPTIONS.MALE,
    GENDER_OPTIONS.FEMALE,
    GENDER_OPTIONS.OTHER
  ]),
  position: z.string().min(1, 'Должность обязательна'),
  hierarchyLevel: z.number().min(1, 'Уровень иерархии должен быть не менее 1'),
  primaryColor: z.string().default('#3B82F6'),
  role: z.string().min(1, 'Роль обязательна'),
  goals: z.string().min(1, 'Цели обязательны'),
  rules: z.string().min(1, 'Правила обязательны'),
  llmProvider: z.string().min(1, 'Провайдер LLM обязателен'),
  llmModel: z.string().min(1, 'Модель LLM обязательна')
});

// Build a reusable ZodObject for form/update schemas (kept as object to allow .partial())
const baseFormBotSchemaObject = botSchema
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
  .merge(formBotFormFields)
  .extend({
    // Allow empty string for avatarUrl and coerce to undefined
    avatarUrl: z
      .union([z.string().url(), z.literal('')])
      .optional()
      .transform((v) => (v === '' ? undefined : v))
  });

// Create schema for creating a bot (all required fields present)
export const formBotSchema = baseFormBotSchemaObject.superRefine(
  (data, ctx) => {
    const providerKey = (
      Object.keys(LLM_PROVIDERS) as Array<keyof typeof LLM_PROVIDERS>
    ).find((k) => LLM_PROVIDERS[k] === data.llmProvider);
    const modelKey = (
      Object.keys(LLM_MODELS) as Array<keyof typeof LLM_MODELS>
    ).find((k) => LLM_MODELS[k] === data.llmModel);
    if (!providerKey || !modelKey) return; // unknown or missing — skip strict check
    const isCompatible = MODELS_BY_PROVIDER[providerKey].includes(
      LLM_MODELS[modelKey]
    );
    if (!isCompatible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['llmModel'],
        message: 'Модель не соответствует выбранному провайдеру'
      });
    }
  }
);

// Create schema for updating a bot (all fields optional)
export const updateBotSchema = baseFormBotSchemaObject
  .partial()
  .superRefine((data, ctx) => {
    // Only validate compatibility when both fields are provided
    if (data.llmProvider === undefined || data.llmModel === undefined) return;
    const providerKey = (
      Object.keys(LLM_PROVIDERS) as Array<keyof typeof LLM_PROVIDERS>
    ).find((k) => LLM_PROVIDERS[k] === data.llmProvider);
    const modelKey = (
      Object.keys(LLM_MODELS) as Array<keyof typeof LLM_MODELS>
    ).find((k) => LLM_MODELS[k] === data.llmModel);
    if (!providerKey || !modelKey) return;
    const isCompatible = MODELS_BY_PROVIDER[providerKey].includes(
      LLM_MODELS[modelKey]
    );
    if (!isCompatible) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['llmModel'],
        message: 'Модель не соответствует выбранному провайдеру'
      });
    }
  });

export { LLM_PROVIDERS, LLM_MODELS, GENDER_OPTIONS };
