import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').unique(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

// Zod схемы для валидации
export const insertEmployeeSchema = createInsertSchema(employees);
export const selectEmployeeSchema = createSelectSchema(employees);

// TypeScript типы
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

// Force re-evaluation
// Additional domain-specific schemas if needed
import { z } from 'zod';

export const employeeSearchSchema = z.object({
  query: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional()
});

export type EmployeeSearch = z.infer<typeof employeeSearchSchema>;
