import type { ChatSession, ChatMessage, ChatSettings, OpenAIMessage, OpenAIResponse } from '../types';

export class ChatApi {
  // Chat management
  static async getChats(): Promise<ChatSession[]> {
    const response = await fetch('/api/llm/chats');
    if (!response.ok) throw new Error('Failed to fetch chats');
    return response.json();
  }

  static async createChat(title: string): Promise<ChatSession> {
    const response = await fetch('/api/llm/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error('Failed to create chat');
    return response.json();
  }

  static async updateChat(chatId: number, updates: Partial<ChatSession>): Promise<ChatSession> {
    const response = await fetch(`/api/llm/chats/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update chat');
    return response.json();
  }

  static async deleteChat(chatId: number): Promise<void> {
    const response = await fetch(`/api/llm/chats/${chatId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete chat');
  }

  // Message management
  static async getChatMessages(chatId: number): Promise<ChatMessage[]> {
    const response = await fetch(`/api/llm/chats/${chatId}/messages`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }

  // Chat with LLM
  static async sendMessage(
    chatId: number,
    message: string,
    settings: ChatSettings
  ): Promise<{
    message: ChatMessage;
    response: ChatMessage;
  }> {
    const response = await fetch('/api/llm/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        message,
        settings,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }

  // Utility methods
  static async generateTitle(message: string): Promise<string> {
    const response = await fetch('/api/llm/generate-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) return 'New Chat';
    const data = await response.json();
    return data.title;
  }
} 