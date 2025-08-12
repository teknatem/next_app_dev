'use client';

import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import { Hash } from 'lucide-react';
import type { Bot as BotType } from '../../..';

export function SystemInfoSection(props: { bot: BotType | null }) {
  const { bot } = props;
  if (!bot) return null;

  return (
    <div className="space-y-4 md:col-span-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Hash className="h-5 w-5" />
        Системная информация
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <Label>ID</Label>
          <div className="p-2 bg-gray-50 rounded font-mono">{bot.id}</div>
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
  );
}
