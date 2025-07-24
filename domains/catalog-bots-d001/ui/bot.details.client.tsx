'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import {
  Eye,
  Edit,
  Save,
  X,
  Loader2,
  AlertCircle,
  Palette,
  User,
  Briefcase,
  Bot,
  Goal,
  Gavel,
  Database,
  Tag,
  Calendar,
  Hash
} from 'lucide-react';
import { getBot, createBot, updateBot } from '../';
import type { Bot as BotType, NewBot } from '../';
import { LLM_PROVIDERS, GENDER_OPTIONS, LLM_MODELS, formBotSchema } from '../';
import { ImagePicker } from '@/domains/catalog-files-d002';
import { FileUploader } from '@/domains/catalog-files-d002';
import type { File as D002File } from '@/domains/catalog-files-d002';

interface BotDetailsProps {
  botId?: string;
  bot?: BotType;
  onSave?: (bot: BotType) => void;
  onCancel?: () => void;
  mode?: 'view' | 'edit' | 'create';
}

export function BotDetails({
  botId,
  bot: initialBot,
  onSave,
  onCancel,
  mode = 'view'
}: BotDetailsProps) {
  const [bot, setBot] = useState<BotType | null>(initialBot || null);
  const [loading, setLoading] = useState(!initialBot && !!botId);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(
    mode === 'edit' || mode === 'create'
  );
  const [saving, setSaving] = useState(false);

  // Форма
  const [formData, setFormData] = useState({
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
    }
  }, [bot]);

  const loadBot = async () => {
    if (!botId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getBot(botId);
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

    const validation = formBotSchema.safeParse(formData);

    if (!validation.success) {
      const errorMsg = validation.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      setError(`Ошибка валидации: ${errorMsg}`);
      setSaving(false);
      return;
    }

    try {
      let result;
      if (mode === 'create') {
        result = await createBot(validation.data);
      } else if (bot?.id) {
        result = await updateBot(bot.id, validation.data);
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
  };

  const getGenderLabel = (gender: string) => {
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
  };

  const getProviderLabel = (provider: string) => {
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

  if (error && !bot) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500 text-center">{error}</div>
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
          <div className="flex gap-2">
            {!isEditing && mode !== 'create' && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
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
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Основная информация
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Имя</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Введите имя бота"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{bot?.name}</div>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Пол</Label>
                {isEditing ? (
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value
                      })
                    }
                    placeholder="male, female, other"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    <Badge variant="outline">
                      {getGenderLabel(bot?.gender || '')}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="position">Должность</Label>
                {isEditing ? (
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Введите должность"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{bot?.position}</div>
                )}
              </div>

              <div>
                <Label htmlFor="hierarchyLevel">Уровень иерархии</Label>
                {isEditing ? (
                  <Input
                    id="hierarchyLevel"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.hierarchyLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hierarchyLevel: parseInt(e.target.value)
                      })
                    }
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    <Badge variant="secondary">{bot?.hierarchyLevel}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Внешний вид */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="avatarUrl">URL аватара</Label>
                {isEditing ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            avatarUrl: e.target.value
                          })
                        }
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <ImagePicker
                        onSelect={(file: D002File) =>
                          setFormData({ ...formData, avatarUrl: file.url })
                        }
                      />
                    </div>
                    <div className="mt-2">
                      <FileUploader
                        onUploadSuccess={(file) => {
                          setFormData({ ...formData, avatarUrl: file.url });
                        }}
                        folder="avatars"
                        compact={true}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {bot?.avatarUrl ? (
                      <img
                        src={bot.avatarUrl}
                        alt={bot.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      'Не указан'
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="primaryColor">Основной цвет</Label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryColor: e.target.value
                        })
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryColor: e.target.value
                        })
                      }
                      placeholder="#3B82F6"
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: bot?.primaryColor }}
                    />
                    {bot?.primaryColor}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI конфигурация */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI конфигурация
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="llmProvider">Провайдер LLM</Label>
                {isEditing ? (
                  <Input
                    id="llmProvider"
                    value={formData.llmProvider}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        llmProvider: e.target.value
                      })
                    }
                    placeholder="openai, anthropic, etc."
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    <Badge variant="outline">
                      {getProviderLabel(bot?.llmProvider || '')}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="llmModel">Модель LLM</Label>
                {isEditing ? (
                  <Input
                    id="llmModel"
                    value={formData.llmModel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        llmModel: e.target
                          .value as (typeof LLM_MODELS)[keyof typeof LLM_MODELS]
                      })
                    }
                    placeholder="gpt-4"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{bot?.llmModel}</div>
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
            </div>
          </div>

          {/* Системная информация */}
          {bot && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Системная информация
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label>ID</Label>
                  <div className="p-2 bg-gray-50 rounded font-mono">
                    {bot.id}
                  </div>
                </div>
                <div>
                  <Label>Версия</Label>
                  <div className="p-2 bg-gray-50 rounded">{bot.version}</div>
                </div>
                <div>
                  <Label>Статус</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    <Badge variant={bot.isDeleted ? 'destructive' : 'default'}>
                      {bot.isDeleted ? 'Удален' : 'Активен'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Создан</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {new Date(bot.createdAt).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div>
                  <Label>Обновлен</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {new Date(bot.updatedAt).toLocaleString('ru-RU')}
                  </div>
                </div>
                {bot.deletedAt && (
                  <div>
                    <Label>Удален</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {new Date(bot.deletedAt).toLocaleString('ru-RU')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
