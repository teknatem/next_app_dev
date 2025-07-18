'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getBots, deleteBot } from '../actions/bots.actions';
import type { Bot } from '../model/bots.schema';
import { LLM_PROVIDERS, GENDER_OPTIONS } from '../model/bots.schema';

interface BotListProps {
  onEdit?: (bot: Bot) => void;
  onView?: (bot: Bot) => void;
  onDelete?: (bot: Bot) => void;
  onCreate?: () => void;
}

export function BotList({ onEdit, onView, onDelete, onCreate }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Пагинация и фильтры
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'position' | 'hierarchyLevel' | 'llmProvider' | 'createdAt'
  >('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadBots = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBots({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        search: search || undefined,
        sortBy,
        sortOrder
      });

      if (result.success && result.data) {
        setBots(result.data.bots);
        setTotal(result.data.total);
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
    loadBots();
  }, [currentPage, search, sortBy, sortOrder]);

  const handleDelete = async (bot: Bot) => {
    if (!confirm(`Вы уверены, что хотите удалить бота "${bot.name}"?`)) {
      return;
    }

    try {
      const result = await deleteBot(bot.id);
      if (result.success) {
        loadBots(); // Перезагружаем список
        onDelete?.(bot);
      } else {
        alert(result.error || 'Failed to delete bot');
      }
    } catch (err) {
      alert('Failed to delete bot');
      console.error('Error deleting bot:', err);
    }
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

  const totalPages = Math.ceil(total / pageSize);

  if (loading && bots.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка ботов...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Боты-сотрудники</CardTitle>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить бота
            </Button>
          )}
        </div>

        {/* Поиск и фильтры */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск по имени, должности..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="border rounded px-3 py-2"
          >
            <option value="createdAt-desc">Сначала новые</option>
            <option value="createdAt-asc">Сначала старые</option>
            <option value="name-asc">По имени А-Я</option>
            <option value="name-desc">По имени Я-А</option>
            <option value="position-asc">По должности А-Я</option>
            <option value="hierarchyLevel-asc">По уровню иерархии</option>
            <option value="llmProvider-asc">По провайдеру</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Пол</TableHead>
              <TableHead>Уровень</TableHead>
              <TableHead>Провайдер</TableHead>
              <TableHead>Модель</TableHead>
              <TableHead>Цвет</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-medium">
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
                      <div className="text-sm text-gray-500">
                        ID: {bot.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{bot.position}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getGenderLabel(bot.gender)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{bot.hierarchyLevel}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getProviderLabel(bot.llmProvider)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {bot.llmModel}
                </TableCell>
                <TableCell>
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: bot.primaryColor }}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(bot)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Просмотр
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(bot)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => handleDelete(bot)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Показано {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, total)} из {total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {bots.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">Боты не найдены</div>
        )}
      </CardContent>
    </Card>
  );
}
