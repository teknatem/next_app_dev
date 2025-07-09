'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  messageCount?: number;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  messageCount
}: ChatSidebarProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="relative"
        >
          <MessageSquare className="w-4 h-4" />
          {messageCount && messageCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {messageCount > 9 ? '9+' : messageCount}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isOpen ? 'Закрыть чат' : 'Открыть чат'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
