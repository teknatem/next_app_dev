import { pgEnum } from 'drizzle-orm/pg-core';

export const employeeStatusEnum = pgEnum('employee_status', [
  'active',
  'inactive',
  'suspended'
]);
