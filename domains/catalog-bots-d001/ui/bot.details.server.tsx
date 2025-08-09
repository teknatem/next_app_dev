import 'server-only';

import { BotDetails } from './bot.details.client';
import { getBot, createBot, updateBot } from '../index.server';
import type { NewBot, UpdateBotParams } from '../types.shared';
import { getImagesAction } from '@/domains/catalog-files-d002/index.server';

export async function BotDetailsServer(props: {
  botId?: string;
  mode?: 'view' | 'edit' | 'create';
}) {
  const { botId, mode = 'view' } = props;

  async function onLoadAction(id: string) {
    'use server';
    return await getBot(id);
  }

  async function onCreateAction(data: NewBot) {
    'use server';
    return await createBot(data);
  }

  async function onUpdateAction(
    id: string,
    data: Partial<NewBot>,
    version: number
  ) {
    'use server';
    const params: UpdateBotParams = { id, data, version };
    return await updateBot(params);
  }

  return (
    <BotDetails
      botId={botId}
      mode={mode}
      onLoadAction={onLoadAction}
      onCreateAction={onCreateAction}
      onUpdateAction={onUpdateAction}
      getImagesAction={getImagesAction}
    />
  );
}
