import type { LlmChat, LlmChatMessage, LlmChatMessageRole } from '@/shared/database/schemas';

// Re-export database types
export type { LlmChat, LlmChatMessage, LlmChatMessageRole };

// UI specific types
export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export interface ChatMessage {
  id: number;
  role: LlmChatMessageRole;
  content: string;
  model?: string;
  createdAt: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: number;
  title: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// OpenAI specific types
export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Chat settings
export interface ChatSettings {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Available models
export const OPENAI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster and more affordable' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
] as const;

export type OpenAIModel = typeof OPENAI_MODELS[number]['id']; 