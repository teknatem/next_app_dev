import 'server-only';

import { BotPicker } from './bot.picker.client';
import { getBots } from '../index.server';

export async function BotPickerServer(props: {
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  async function onLoadAction(params: { limit?: number; search?: string }) {
    'use server';
    const r = await getBots({
      limit: params.limit ?? 100,
      search: params.search,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    return r.success ? r.data : { bots: [], total: 0 };
  }

  return (
    <BotPicker
      multiple={props.multiple}
      placeholder={props.placeholder}
      disabled={props.disabled}
      className={props.className}
      onLoadAction={onLoadAction}
    />
  );
}
