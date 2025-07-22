import { z } from 'zod';
import { employeeStatusEnum } from './model/employees.schema';

// Manual schema definition (shared, no server dependencies)
export const employeeSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean(),
  deletedAt: z.date().nullable(),
  createdBy: z.string().uuid().nullable(),
  updatedBy: z.string().uuid().nullable(),
  deletedBy: z.string().uuid().nullable(),
  tenantId: z.string().uuid().nullable(),
  fullName: z.string().min(1),
  email: z.string().email().nullable().optional(),
  position: z.string().min(1),
  department: z.string().min(1),
  isActive: z.boolean(),
  metadata: z.record(z.any()).nullable(),
  status: z.enum(employeeStatusEnum.enumValues).nullable()
});

export const insertEmployeeSchema = employeeSchema
  .omit({
    id: true,
    version: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export const createEmployeeSchema = insertEmployeeSchema.refine(
  (data) => {
    return (
      typeof data.fullName === 'string' &&
      data.fullName.length > 0 &&
      typeof data.position === 'string' &&
      data.position.length > 0 &&
      typeof data.department === 'string' &&
      data.department.length > 0
    );
  },
  {
    message: 'Full name, position, and department are required for creation.'
  }
);

// Export the main Employee type
export type Employee = z.infer<typeof employeeSchema>;
export type NewEmployee = z.infer<typeof insertEmployeeSchema>;

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
  status: z.enum(employeeStatusEnum.enumValues).optional(),
  metadata: z.record(z.any()).optional()
});
export type EmployeeUpdate = z.infer<typeof updateEmployeeSchema>;

// Back-compat aliases
export const selectEmployeeSchema = employeeSchema;
export const insertD003EmployeeSchema = insertEmployeeSchema;
export const selectD003EmployeeSchema = employeeSchema;
