'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ChatSession, ChatSettings } from '../types';

interface ChatState {
  // UI state
  isOpen: boolean;
  width: number;
  currentChatId: number | null;
  
  // Chat data
  chats: ChatSession[];
  messages: Record<number, ChatMessage[]>;
  settings: ChatSettings;
  
  // Loading states
  isLoading: boolean;
  isSending: boolean;
  
  // Actions
  toggleChat: () => void;
  setWidth: (width: number) => void;
  setCurrentChat: (chatId: number | null) => void;
  
  // Chat operations
  addChat: (chat: ChatSession) => void;
  updateChat: (chatId: number, updates: Partial<ChatSession>) => void;
  deleteChat: (chatId: number) => void;
  
  // Message operations
  addMessage: (chatId: number, message: ChatMessage) => void;
  updateMessage: (chatId: number, messageId: number, updates: Partial<ChatMessage>) => void;
  setMessages: (chatId: number, messages: ChatMessage[]) => void;
  
  // Settings
  updateSettings: (settings: Partial<ChatSettings>) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      width: 20, // 20% of screen width
      currentChatId: null,
      chats: [],
      messages: {},
      settings: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      },
      isLoading: false,
      isSending: false,
      
      // UI actions
      toggleChat: () => set(state => ({ isOpen: !state.isOpen })),
      setWidth: (width: number) => set({ width: Math.max(20, Math.min(50, width)) }),
      setCurrentChat: (chatId: number | null) => set({ currentChatId: chatId }),
      
      // Chat operations
      addChat: (chat: ChatSession) => set(state => ({ 
        chats: [chat, ...state.chats],
        currentChatId: chat.id 
      })),
      
      updateChat: (chatId: number, updates: Partial<ChatSession>) => 
        set(state => ({
          chats: state.chats.map(chat => 
            chat.id === chatId ? { ...chat, ...updates } : chat
          )
        })),
      
      deleteChat: (chatId: number) => set(state => {
        const newChats = state.chats.filter(chat => chat.id !== chatId);
        const newMessages = { ...state.messages };
        delete newMessages[chatId];
        
        return {
          chats: newChats,
          messages: newMessages,
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId
        };
      }),
      
      // Message operations
      addMessage: (chatId: number, message: ChatMessage) => set(state => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message]
        }
      })),
      
      updateMessage: (chatId: number, messageId: number, updates: Partial<ChatMessage>) => 
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId]?.map(msg => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            ) || []
          }
        })),
      
      setMessages: (chatId: number, messages: ChatMessage[]) => set(state => ({
        messages: {
          ...state.messages,
          [chatId]: messages
        }
      })),
      
      // Settings
      updateSettings: (settings: Partial<ChatSettings>) => set(state => ({
        settings: { ...state.settings, ...settings }
      })),
      
      // Loading states
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setSending: (sending: boolean) => set({ isSending: sending }),
    }),
    {
      name: 'llm-chat-store',
      partialize: (state) => ({
        width: state.width,
        settings: state.settings,
        currentChatId: state.currentChatId,
      }),
    }
  )
); 