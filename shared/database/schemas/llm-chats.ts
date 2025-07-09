import { pgTable, serial, varchar, timestamp, text, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const llmChats = pgTable('llm_chats', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  
  // Metadata
  messageCount: integer('message_count').default(0),
  totalTokens: integer('total_tokens').default(0),
  totalCost: decimal('total_cost', { precision: 10, scale: 6 }).default('0'),
  
  // Settings
  defaultModel: varchar('default_model', { length: 50 }).default('gpt-3.5-turbo'),
  systemPrompt: text('system_prompt'),
  
  // Additional metadata
  metadata: jsonb('metadata').default({}),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zod schemas
export const insertLlmChatSchema = createInsertSchema(llmChats).omit({
  id: true,
  messageCount: true,
  totalTokens: true,
  totalCost: true,
  createdAt: true,
  updatedAt: true,
});

export const selectLlmChatSchema = createSelectSchema(llmChats);

export const updateLlmChatSchema = insertLlmChatSchema.partial();

// TypeScript types
export type LlmChat = typeof llmChats.$inferSelect;
export type NewLlmChat = typeof llmChats.$inferInsert;
export type UpdateLlmChat = z.infer<typeof updateLlmChatSchema>; 