import 'server-only';

import { BotList } from './bot.list.client';
import { getBots, deleteBot } from '../index.server';
import type { GetBotsParams, Bot } from '../types.shared';

export async function BotListServer(props: {
  page?: number;
  search?: string;
  sortBy?: GetBotsParams['sortBy'];
  sortOrder?: GetBotsParams['sortOrder'];
}) {
  const page = props.page ?? 1;
  const pageSize = 10;
  const sortBy = props.sortBy ?? 'createdAt';
  const sortOrder = props.sortOrder ?? 'desc';

  const result = await getBots({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    search: props.search,
    sortBy,
    sortOrder
  });

  const initialData = result.success ? result.data : { bots: [], total: 0 };

  async function onDeleteAction(id: string, version: number) {
    'use server';
    await deleteBot({ id, version });
  }

  async function onLoadAction(params: GetBotsParams) {
    'use server';
    const r = await getBots(params);
    return r.success ? r.data : { bots: [], total: 0 };
  }

  return (
    <BotList
      initialData={initialData}
      onDeleteAction={onDeleteAction}
      onLoadAction={onLoadAction}
    />
  );
}
