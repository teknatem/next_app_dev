'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Edit, Save, X } from 'lucide-react';
// server actions не импортируются напрямую; будут прокинуты через пропы server-обёртки
import type { Bot as BotType, NewBot } from '../../';
import type { UpdateBotParams } from '../../types.shared';
import {
  LLM_PROVIDERS,
  GENDER_OPTIONS,
  LLM_MODELS,
  formBotSchema
} from '../../';
import type { BotFormData, BotFormErrors } from './types';
import { BasicInfoSection } from './sections/basic-info.client';
import { AppearanceSection } from './sections/appearance.client';
import { AIConfigSection } from './sections/ai-config.client';
import { SystemInfoSection } from './sections/system-info.client';

interface BotDetailsProps {
  botId?: string;
  bot?: BotType;
  onSave?: (bot: BotType) => void;
  onCancel?: () => void;
  mode?: 'view' | 'edit' | 'create';
  onLoadAction?: (
    id: string
  ) => Promise<{ success: boolean; data?: BotType; error?: string }>;
  onCreateAction?: (
    data: NewBot
  ) => Promise<{ success: boolean; data?: BotType; error?: string }>;
  onUpdateAction?: (
    params: UpdateBotParams
  ) => Promise<{ success: boolean; data?: BotType; error?: string }>;
}

export function BotDetails({
  botId,
  bot: initialBot,
  onSave,
  onCancel,
  mode = 'view',
  onLoadAction,
  onCreateAction,
  onUpdateAction
}: BotDetailsProps) {
  const [bot, setBot] = useState<BotType | null>(initialBot || null);
  const [loading, setLoading] = useState(!initialBot && !!botId);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(
    mode === 'edit' || mode === 'create'
  );
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<BotFormErrors>({});
  const router = useRouter();

  // Форма
  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    gender: GENDER_OPTIONS.MALE as string,
    position: '',
    hierarchyLevel: 1,
    avatarUrl: '',
    primaryColor: '#3B82F6',
    role: '',
    goals: '',
    rules: '',
    llmProvider: LLM_PROVIDERS.OPENAI as string,
    llmModel: LLM_MODELS.GPT_4 as string
  });

  useEffect(() => {
    if (botId && !initialBot) {
      loadBot();
    }
  }, [botId, initialBot]);

  // Ensure create mode stays in editing even after route refresh or validation attempts
  useEffect(() => {
    if (mode === 'create') {
      setIsEditing(true);
    }
  }, [mode, error]);

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name,
        gender: bot.gender,
        position: bot.position,
        hierarchyLevel: bot.hierarchyLevel,
        avatarUrl: bot.avatarUrl || '',
        primaryColor: bot.primaryColor,
        role: bot.role,
        goals: bot.goals,
        rules: bot.rules,
        llmProvider: bot.llmProvider,
        llmModel: bot.llmModel
      });
      setFormErrors({});
    }
  }, [bot]);

  const loadBot = async () => {
    if (!botId) return;

    setLoading(true);
    setError(null);

    try {
      if (!onLoadAction) return;
      const result = await onLoadAction(botId);
      if (result.success && result.data) {
        setBot(result.data);
      } else {
        setError(result.error || 'Failed to load bot');
      }
    } catch (err) {
      setError('Failed to load bot');
      console.error('Error loading bot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setFormErrors({});

    const validation = formBotSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: BotFormErrors = {};
      for (const issue of validation.error.errors) {
        const field = issue.path?.[0] as keyof BotFormData | undefined;
        if (field) {
          fieldErrors[field] = issue.message;
        }
      }
      setFormErrors(fieldErrors);
      setSaving(false);
      return;
    }

    try {
      let result;
      if (mode === 'create') {
        if (!onCreateAction) throw new Error('onCreateAction is not provided');
        result = await onCreateAction(validation.data);
      } else if (bot?.id) {
        if (!onUpdateAction) throw new Error('onUpdateAction is not provided');
        result = await onUpdateAction({
          id: bot.id,
          data: validation.data,
          version: bot.version
        });
      } else {
        throw new Error('Невозможно сохранить: ID бота отсутствует');
      }

      if (result.success && result.data) {
        setBot(result.data);
        setIsEditing(false);
        onSave?.(result.data);
      } else {
        setError(result.error || 'Не удалось сохранить бота');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Error saving bot:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (bot) {
      setFormData({
        name: bot.name,
        gender:
          bot.gender as (typeof GENDER_OPTIONS)[keyof typeof GENDER_OPTIONS],
        position: bot.position,
        hierarchyLevel: bot.hierarchyLevel,
        avatarUrl: bot.avatarUrl || '',
        primaryColor: bot.primaryColor,
        role: bot.role,
        goals: bot.goals,
        rules: bot.rules,
        llmProvider:
          bot.llmProvider as (typeof LLM_PROVIDERS)[keyof typeof LLM_PROVIDERS],
        llmModel: bot.llmModel as (typeof LLM_MODELS)[keyof typeof LLM_MODELS]
      });
    }
    setIsEditing(false);
    onCancel?.();
    if (!onCancel) {
      router.back();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка бота...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {mode === 'create' ? 'Создание бота' : bot?.name || 'Бот'}
          </CardTitle>
          <div className="flex gap-2 items-center">
            {/* Close button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Закрыть"
              onClick={() => (onCancel ? onCancel() : router.back())}
            >
              <X className="h-4 w-4" />
            </Button>
            {!isEditing && mode !== 'create' && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  type="button"
                  onClick={handleSave}
                  size="sm"
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoSection
            isEditing={isEditing}
            bot={bot}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          <AppearanceSection
            isEditing={isEditing}
            bot={bot}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          <AIConfigSection
            isEditing={isEditing}
            bot={bot}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          <SystemInfoSection bot={bot} />
        </div>
      </CardContent>
    </Card>
  );
}
