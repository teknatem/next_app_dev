import 'server-only';

import { BotDetails } from './bot-details.client';
import { getBot, createBot, updateBot } from '../../index.server';

export function BotDetailsWidget(props: {
  botId?: string;
  mode?: 'view' | 'edit' | 'create';
}) {
  const { botId, mode = 'view' } = props;

  return (
    <BotDetails
      botId={botId}
      mode={mode}
      onLoadAction={getBot}
      onCreateAction={createBot}
      onUpdateAction={updateBot}
    />
  );
}
