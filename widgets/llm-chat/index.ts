/**
 * @id W-004 LlmChat
 * @layer widgets
 * @summary Comprehensive chat interface for AI conversations with LLM models
 * @description A complete chat system providing real-time messaging with LLM models (GPT-3.5, GPT-4, etc.), persistent chat sessions stored in PostgreSQL, resizable chat window with professional UI, message history and conversation management, token usage tracking and cost calculation, and settings for model selection and parameters.
 *
 * @fileoverview LLM Chat Widget - A comprehensive chat interface for AI conversations
 *
 * This widget provides a complete chat system with:
 * - Real-time messaging with LLM models (GPT-3.5, GPT-4, etc.)
 * - Persistent chat sessions stored in PostgreSQL
 * - Resizable chat window with professional UI
 * - Message history and conversation management
 * - Token usage tracking and cost calculation
 * - Settings for model selection and parameters
 *
 * @module widgets/llm-chat
 * @version 1.0.0
 * @author LLM Chat Team
 * @since 27.01.2025
 */

export { ChatProvider } from './ui/chat-provider';
export { ChatToggleButton } from './ui/chat-toggle-button';
export { ChatWindow } from './ui/chat-window';

export type {
  ChatWindowProps,
  ChatMessage as LlmChatMessage,
  ChatSession as LlmChat,
  ChatSettings,
  OpenAIModel
} from './types';

export { useChatStore } from './lib/chat-store';
