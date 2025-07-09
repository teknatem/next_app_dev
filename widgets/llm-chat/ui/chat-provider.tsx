'use client';

import { ChatWindow } from './chat-window';
import { ChatSidebar } from './chat-sidebar';
import { useChatStore } from '../lib/chat-store';

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { isOpen, width, toggleChat, setWidth, chats, currentChatId } =
    useChatStore();

  const handleClose = () => {
    useChatStore.getState().toggleChat();
  };

  return (
    <>
      {children}
      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        width={width}
        onWidthChange={setWidth}
      />
    </>
  );
}

export { ChatSidebar };
