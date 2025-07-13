'use client';

import { MessageSquare } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

import { useChatStore } from '../lib/chat-store';

export function ChatToggleButton() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleChat}
          className={isOpen ? 'bg-accent' : ''}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isOpen ? 'Закрыть чат' : 'Открыть чат'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
