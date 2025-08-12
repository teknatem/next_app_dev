import { GENDER_OPTIONS, LLM_PROVIDERS } from '../types.shared';

export function getGenderLabel(gender: string): string {
  switch (gender) {
    case GENDER_OPTIONS.MALE:
      return 'Мужской';
    case GENDER_OPTIONS.FEMALE:
      return 'Женский';
    case GENDER_OPTIONS.OTHER:
      return 'Другой';
    default:
      return gender;
  }
}

export function getProviderLabel(provider: string): string {
  switch (provider) {
    case LLM_PROVIDERS.OPENAI:
      return 'OpenAI';
    case LLM_PROVIDERS.ANTHROPIC:
      return 'Anthropic';
    case LLM_PROVIDERS.YANDEX:
      return 'Yandex';
    case LLM_PROVIDERS.GOOGLE:
      return 'Google';
    case LLM_PROVIDERS.MISTRAL:
      return 'Mistral';
    default:
      return provider;
  }
}
