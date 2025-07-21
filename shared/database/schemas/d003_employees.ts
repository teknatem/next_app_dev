import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users';

// d003_employees table following memory-bank naming convention and field requirements
export const d003Employees = pgTable('d003_employees', {
  // Mandatory fields
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Soft delete
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),

  // Audit fields
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),
  deletedBy: uuid('deleted_by').references(() => users.id),

  // Multi-tenant support
  tenantId: uuid('tenant_id'),

  // Business fields
  fullName: text('full_name').notNull(),
  email: text('email').unique(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  isActive: boolean('is_active').notNull().default(true),

  // Flexible data storage
  metadata: jsonb('metadata'),
  status: varchar('status', { length: 20 }).default('active')
});

// Zod schemas for validation
export const insertD003EmployeeSchema = createInsertSchema(d003Employees);
export const selectD003EmployeeSchema = createSelectSchema(d003Employees);

// TypeScript types
export type D003Employee = typeof d003Employees.$inferSelect;
export type NewD003Employee = typeof d003Employees.$inferInsert;

// Backward compatibility aliases
export const employees = d003Employees;
export type Employee = D003Employee;
export type NewEmployee = NewD003Employee;
export const insertEmployeeSchema = insertD003EmployeeSchema;
export const selectEmployeeSchema = selectD003EmployeeSchema;

export * from '@/domains/catalog-employees-d003/orm.server';
export * from '@/domains/catalog-employees-d003/types.shared';
