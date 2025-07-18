'use client';

import { BotList, BotDetails, BotPicker } from '@/domains/catalog-bots-d001';
import { useState } from 'react';

export default function BotsPage() {
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [selectedBots, setSelectedBots] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');

  const handleEdit = (bot: any) => {
    setSelectedBot(bot);
    setMode('edit');
    setShowDetails(true);
  };

  const handleView = (bot: any) => {
    setSelectedBot(bot);
    setMode('view');
    setShowDetails(true);
  };

  const handleDelete = (bot: any) => {
    console.log('Delete bot:', bot);
  };

  const handleCreate = () => {
    setSelectedBot(null);
    setMode('create');
    setShowDetails(true);
  };

  const handleSave = (bot: any) => {
    console.log('Save bot:', bot);
    setShowDetails(false);
  };

  const handleCancel = () => {
    setShowDetails(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление ботами-сотрудниками</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной контент */}
        <div className="lg:col-span-2">
          {showDetails ? (
            <BotDetails
              bot={selectedBot}
              mode={mode}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <BotList
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Выбор одного бота */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Выбор бота</h3>
            <BotPicker
              selectedBots={selectedBot ? [selectedBot] : []}
              onSelect={(bots) => setSelectedBot(bots[0] || null)}
              placeholder="Выберите бота..."
            />
          </div>

          {/* Выбор нескольких ботов */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Выбор нескольких ботов</h3>
            <BotPicker
              selectedBots={selectedBots}
              onSelect={setSelectedBots}
              multiple={true}
              placeholder="Выберите ботов..."
            />
            {selectedBots.length > 0 && (
              <div className="text-sm text-gray-600">
                Выбрано: {selectedBots.length} ботов
              </div>
            )}
          </div>

          {/* Информация о выбранном боте */}
          {selectedBot && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Выбранный бот</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  {selectedBot.avatarUrl && (
                    <img
                      src={selectedBot.avatarUrl}
                      alt={selectedBot.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{selectedBot.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedBot.position}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div>Пол: {selectedBot.gender}</div>
                  <div>Уровень: {selectedBot.hierarchyLevel}</div>
                  <div>Провайдер: {selectedBot.llmProvider}</div>
                  <div>Модель: {selectedBot.llmModel}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
