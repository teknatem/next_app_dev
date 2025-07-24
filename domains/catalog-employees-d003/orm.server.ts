import 'server-only';

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  varchar,
  pgEnum
} from 'drizzle-orm/pg-core';
import { users } from '@/shared/database/schemas/users';
import { EMPLOYEE_STATUS_VALUES } from './model/enums';

// Re-export from model/enums for server-side usage
export * from './model/enums';

// Create pgEnum using the shared values
export const employeeStatusEnum = pgEnum(
  'employee_status',
  EMPLOYEE_STATUS_VALUES
);

export const d003Employees = pgTable('d003_employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),

  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),
  deletedBy: uuid('deleted_by').references(() => users.id),
  tenantId: uuid('tenant_id'),

  fullName: text('full_name').notNull(),
  email: text('email').unique(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  isActive: boolean('is_active').notNull().default(true),

  metadata: jsonb('metadata').$type<Record<string, any>>(),
  status: employeeStatusEnum('status')
});

export type D003Employee = typeof d003Employees.$inferSelect;
export type NewD003Employee = typeof d003Employees.$inferInsert;

// Back-compat aliases
export const employees = d003Employees;
export type Employee = D003Employee;
export type NewEmployee = NewD003Employee;
