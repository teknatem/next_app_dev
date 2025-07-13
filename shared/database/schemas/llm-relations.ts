import { relations } from 'drizzle-orm';

import { llmChatMessages } from './llm-chat-messages';
import { llmChats } from './llm-chats';

export const llmChatsRelations = relations(llmChats, ({ many }) => ({
  messages: many(llmChatMessages),
}));

export const llmChatMessagesRelations = relations(llmChatMessages, ({ one }) => ({
  chat: one(llmChats, {
    fields: [llmChatMessages.chatId],
    references: [llmChats.id],
  }),
})); 