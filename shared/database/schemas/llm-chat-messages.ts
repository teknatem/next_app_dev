import { pgTable, serial, integer, varchar, text, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const llmChatMessages = pgTable('llm_chat_messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').notNull(),
  
  // Message data
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  
  // Model and API data
  model: varchar('model', { length: 50 }),
  provider: varchar('provider', { length: 20 }).default('openai'),
  
  // Token usage
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  totalTokens: integer('total_tokens'),
  
  // Cost tracking
  cost: decimal('cost', { precision: 10, scale: 6 }),
  
  // API response metadata
  finishReason: varchar('finish_reason', { length: 50 }),
  responseTime: integer('response_time'), // milliseconds
  
  // Additional metadata from API
  metadata: jsonb('metadata').default({}),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod schemas
export const insertLlmChatMessageSchema = createInsertSchema(llmChatMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  role: z.enum(['user', 'assistant', 'system']),
});

export const selectLlmChatMessageSchema = createSelectSchema(llmChatMessages);

// TypeScript types
export type LlmChatMessage = typeof llmChatMessages.$inferSelect;
export type NewLlmChatMessage = typeof llmChatMessages.$inferInsert;
export type LlmChatMessageRole = 'user' | 'assistant' | 'system'; 