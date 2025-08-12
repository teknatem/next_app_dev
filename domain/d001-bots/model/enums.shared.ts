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
