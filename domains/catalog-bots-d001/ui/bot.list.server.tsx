import 'server-only';

import { BotList } from './bot.list.client';
import { getBots, deleteBot } from '../index.server';

export async function BotListServer(props: {
  page?: number;
  search?: string;
  sortBy?: 'name' | 'position' | 'hierarchyLevel' | 'llmProvider' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
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

  async function onDeleteAction(id: string) {
    'use server';
    await deleteBot(id);
  }

  async function onLoadAction(params: {
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?:
      | 'name'
      | 'position'
      | 'hierarchyLevel'
      | 'llmProvider'
      | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) {
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
