import { eq, desc } from 'drizzle-orm';

import { db } from '../connection';
import { llmChats, llmChatMessages } from '../schemas';
import type { 
  LlmChat, 
  NewLlmChat, 
  UpdateLlmChat,
  LlmChatMessage,
  NewLlmChatMessage 
} from '../schemas';

export class LlmChatService {
  // Chat operations
  async createChat(data: NewLlmChat): Promise<LlmChat> {
    const [chat] = await db.insert(llmChats).values(data).returning();
    return chat;
  }

  async getChatById(id: number): Promise<LlmChat | null> {
    const [chat] = await db.select().from(llmChats).where(eq(llmChats.id, id));
    return chat || null;
  }

  async getAllChats(): Promise<LlmChat[]> {
    return await db.select().from(llmChats).orderBy(desc(llmChats.updatedAt));
  }

  async updateChat(id: number, data: UpdateLlmChat): Promise<LlmChat | null> {
    const [chat] = await db
      .update(llmChats)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(llmChats.id, id))
      .returning();
    return chat || null;
  }

  async deleteChat(id: number): Promise<boolean> {
    // Delete messages first
    await db.delete(llmChatMessages).where(eq(llmChatMessages.chatId, id));
    // Delete chat
    const result = await db.delete(llmChats).where(eq(llmChats.id, id)).returning();
    return result.length > 0;
  }

  // Message operations
  async addMessage(data: NewLlmChatMessage): Promise<LlmChatMessage> {
    const [message] = await db.insert(llmChatMessages).values(data).returning();
    
    // Update chat metadata
    await this.updateChatMetadata(data.chatId);
    
    return message;
  }

  async getChatMessages(chatId: number): Promise<LlmChatMessage[]> {
    return await db
      .select()
      .from(llmChatMessages)
      .where(eq(llmChatMessages.chatId, chatId))
      .orderBy(llmChatMessages.createdAt);
  }

  async getChatWithMessages(chatId: number): Promise<(LlmChat & { messages: LlmChatMessage[] }) | null> {
    const chat = await this.getChatById(chatId);
    if (!chat) return null;
    
    const messages = await this.getChatMessages(chatId);
    return { ...chat, messages };
  }

  // Update chat metadata after new message
  private async updateChatMetadata(chatId: number): Promise<void> {
    const messages = await this.getChatMessages(chatId);
    const totalTokens = messages.reduce((sum, msg) => sum + (msg.totalTokens || 0), 0);
    const totalCost = messages.reduce((sum, msg) => sum + parseFloat(msg.cost || '0'), 0);
    
    await db
      .update(llmChats)
      .set({
        messageCount: messages.length,
        totalTokens,
        totalCost: totalCost.toString(),
        updatedAt: new Date(),
      })
      .where(eq(llmChats.id, chatId));
  }
} 