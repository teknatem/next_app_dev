import { BotListServer } from '@/domain/d001-bots/index.server';

export default async function BotsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление ботами-сотрудниками</h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <BotListServer />
      </div>
    </div>
  );
}
