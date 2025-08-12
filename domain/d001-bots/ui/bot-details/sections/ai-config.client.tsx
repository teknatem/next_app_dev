'use client';

import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Bot as BotIcon } from 'lucide-react';
import { getProviderLabel } from '../../labels.shared';
import type { Bot as BotType } from '../../..';
import { LLM_PROVIDERS, LLM_MODELS } from '../../..';
import type { BotFormData, BotFormErrors } from '../types';

export function AIConfigSection(props: {
  isEditing: boolean;
  bot: BotType | null;
  formData: BotFormData;
  setFormData: React.Dispatch<React.SetStateAction<BotFormData>>;
  formErrors: BotFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<BotFormErrors>>;
}) {
  const { isEditing, bot, formData, setFormData, formErrors, setFormErrors } =
    props;

  return (
    <div className="space-y-4 md:col-span-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <BotIcon className="h-5 w-5" />
        AI конфигурация
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="llmProvider">Провайдер LLM</Label>
          {isEditing ? (
            <select
              id="llmProvider"
              className="w-full border rounded-md h-9 px-3 bg-white"
              value={formData.llmProvider}
              onChange={(e) => {
                setFormData({ ...formData, llmProvider: e.target.value });
                setFormErrors((prev) => ({ ...prev, llmProvider: undefined }));
              }}
            >
              <option value="" disabled>
                Выберите провайдера
              </option>
              <option value={LLM_PROVIDERS.OPENAI}>OpenAI</option>
              <option value={LLM_PROVIDERS.ANTHROPIC}>Anthropic</option>
              <option value={LLM_PROVIDERS.YANDEX}>Yandex</option>
              <option value={LLM_PROVIDERS.GOOGLE}>Google</option>
              <option value={LLM_PROVIDERS.MISTRAL}>Mistral</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              <Badge variant="outline">
                {getProviderLabel(bot?.llmProvider || '')}
              </Badge>
            </div>
          )}
          {isEditing && formErrors.llmProvider && (
            <div className="text-sm text-red-500 mt-1">
              {formErrors.llmProvider}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="llmModel">Модель LLM</Label>
          {isEditing ? (
            <select
              id="llmModel"
              className="w-full border rounded-md h-9 px-3 bg-white"
              value={formData.llmModel}
              onChange={(e) => {
                setFormData({ ...formData, llmModel: e.target.value });
                setFormErrors((prev) => ({ ...prev, llmModel: undefined }));
              }}
            >
              <option value="" disabled>
                Выберите модель
              </option>
              {/* OpenAI */}
              <option value={LLM_MODELS.GPT_4}>gpt-4</option>
              <option value={LLM_MODELS.GPT_4_TURBO}>gpt-4-turbo</option>
              <option value={LLM_MODELS.GPT_3_5_TURBO}>gpt-3.5-turbo</option>
              {/* Anthropic */}
              <option value={LLM_MODELS.CLAUDE_3_OPUS}>claude-3-opus</option>
              <option value={LLM_MODELS.CLAUDE_3_SONNET}>
                claude-3-sonnet
              </option>
              <option value={LLM_MODELS.CLAUDE_3_HAIKU}>claude-3-haiku</option>
              {/* Yandex */}
              <option value={LLM_MODELS.YANDEX_GPT}>yandex-gpt</option>
              <option value={LLM_MODELS.YANDEX_GPT_LITE}>
                yandex-gpt-lite
              </option>
              {/* Google */}
              <option value={LLM_MODELS.GEMINI_PRO}>gemini-pro</option>
              <option value={LLM_MODELS.GEMINI_FLASH}>gemini-flash</option>
              {/* Mistral */}
              <option value={LLM_MODELS.MISTRAL_LARGE}>mistral-large</option>
              <option value={LLM_MODELS.MISTRAL_MEDIUM}>mistral-medium</option>
              <option value={LLM_MODELS.MISTRAL_SMALL}>mistral-small</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded">{bot?.llmModel}</div>
          )}
          {isEditing && formErrors.llmModel && (
            <div className="text-sm text-red-500 mt-1">
              {formErrors.llmModel}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="role">Роль (для Prompt)</Label>
        {isEditing ? (
          <textarea
            id="role"
            value={formData.role}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, role: e.target.value })
            }
            placeholder="Опишите роль бота..."
            rows={3}
            className="w-full p-3 border rounded-md resize-none"
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">
            {bot?.role}
          </div>
        )}
        {isEditing && formErrors.role && (
          <div className="text-sm text-red-500 mt-1">{formErrors.role}</div>
        )}
      </div>

      <div>
        <Label htmlFor="goals">Цели (для Prompt)</Label>
        {isEditing ? (
          <textarea
            id="goals"
            value={formData.goals}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, goals: e.target.value })
            }
            placeholder="Опишите цели бота..."
            rows={3}
            className="w-full p-3 border rounded-md resize-none"
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">
            {bot?.goals}
          </div>
        )}
        {isEditing && formErrors.goals && (
          <div className="text-sm text-red-500 mt-1">{formErrors.goals}</div>
        )}
      </div>

      <div>
        <Label htmlFor="rules">Правила (для Prompt)</Label>
        {isEditing ? (
          <textarea
            id="rules"
            value={formData.rules}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, rules: e.target.value })
            }
            placeholder="Опишите правила поведения бота..."
            rows={3}
            className="w-full p-3 border rounded-md resize-none"
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded whitespace-pre-wrap">
            {bot?.rules}
          </div>
        )}
        {isEditing && formErrors.rules && (
          <div className="text-sm text-red-500 mt-1">{formErrors.rules}</div>
        )}
      </div>
    </div>
  );
}
