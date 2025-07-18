'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { Search, Check, X, ChevronDown, User } from 'lucide-react';
import { getBots } from '../actions/bots.actions';
import type { Bot } from '../model/bots.schema';
import { LLM_PROVIDERS, GENDER_OPTIONS } from '../model/bots.schema';

interface BotPickerProps {
  selectedBots?: Bot[];
  onSelect?: (bots: Bot[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function BotPicker({
  selectedBots = [],
  onSelect,
  multiple = false,
  placeholder = 'Выберите бота...',
  disabled = false,
  className = ''
}: BotPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadBots = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBots({
        limit: 100,
        search: search || undefined,
        sortBy: 'name',
        sortOrder: 'asc'
      });

      if (result.success && result.data) {
        setBots(result.data.bots);
      } else {
        setError(result.error || 'Failed to load bots');
      }
    } catch (err) {
      setError('Failed to load bots');
      console.error('Error loading bots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBots();
    }
  }, [isOpen, search]);

  const handleSelect = (bot: Bot) => {
    if (multiple) {
      const isSelected = selectedBots.some((b) => b.id === bot.id);
      let newSelection: Bot[];

      if (isSelected) {
        newSelection = selectedBots.filter((b) => b.id !== bot.id);
      } else {
        newSelection = [...selectedBots, bot];
      }

      onSelect?.(newSelection);
    } else {
      onSelect?.([bot]);
      setIsOpen(false);
    }
  };

  const handleRemove = (botId: string) => {
    const newSelection = selectedBots.filter((b) => b.id !== botId);
    onSelect?.(newSelection);
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

  const isSelected = (bot: Bot) => {
    return selectedBots.some((b) => b.id === bot.id);
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {selectedBots.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : multiple ? (
                <span>{selectedBots.length} ботов выбрано</span>
              ) : (
                <span>{selectedBots[0].name}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {multiple ? 'Выберите ботов' : 'Выберите бота'}
            </DialogTitle>
          </DialogHeader>

          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск по имени, должности..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Выбранные боты (только для multiple) */}
          {multiple && selectedBots.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
              {selectedBots.map((bot) => (
                <Badge
                  key={bot.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {bot.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemove(bot.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Список ботов */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">Загрузка ботов...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : bots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Боты не найдены
              </div>
            ) : (
              <div className="space-y-2">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected(bot) ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelect(bot)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {bot.avatarUrl && (
                          <img
                            src={bot.avatarUrl}
                            alt={bot.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{bot.name}</div>
                          <div className="text-sm text-gray-600">
                            {bot.position}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getGenderLabel(bot.gender)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getProviderLabel(bot.llmProvider)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Ур. {bot.hierarchyLevel}
                        </Badge>
                        {isSelected(bot) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          {multiple && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => setIsOpen(false)}>Готово</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
