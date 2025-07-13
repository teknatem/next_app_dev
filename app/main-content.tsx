'use client';

import React from 'react';

import { useChatStore } from '@/widgets/llm-chat/lib/chat-store';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen: isChatOpen, width: chatWidth } = useChatStore();

  return (
    <div
      className="flex flex-1 flex-col sm:pl-14"
      style={{
        marginRight: isChatOpen ? `${chatWidth}%` : '0',
        transition: 'margin-right 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  );
}
