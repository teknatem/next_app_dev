import { BotDetailsWidget } from '@/domains/catalog-bots-d001/index.server';
import { BackButton } from '@/shared/ui/back-button';

export default async function BotDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;

  const isNew = id === 'new';
  const effectiveMode: 'view' | 'edit' | 'create' = isNew
    ? 'create'
    : mode === 'edit'
      ? 'edit'
      : 'view';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">
          {isNew ? 'Создание бота' : 'Детали бота'}
        </h1>
      </div>
      <BotDetailsWidget botId={isNew ? undefined : id} mode={effectiveMode} />
    </div>
  );
}
