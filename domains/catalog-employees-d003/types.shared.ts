import { z } from 'zod';
import { d003Employees } from './orm.server';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const insertD003EmployeeSchema = createInsertSchema(d003Employees);
export const selectD003EmployeeSchema = createSelectSchema(d003Employees);

export const employeeSearchSchema = z.object({
  query: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional()
});
export type EmployeeSearch = z.infer<typeof employeeSearchSchema>;

export const updateEmployeeSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(0),
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  position: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  metadata: z.record(z.any()).optional()
});
export type EmployeeUpdate = z.infer<typeof updateEmployeeSchema>;

// Back-compat aliases
export const insertEmployeeSchema = insertD003EmployeeSchema;
export const selectEmployeeSchema = selectD003EmployeeSchema;
