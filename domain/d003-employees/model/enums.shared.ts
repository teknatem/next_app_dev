// Domain-specific enums for catalog-employees-d003 (client-safe)

export const EMPLOYEE_STATUS_VALUES = [
  'active',
  'inactive',
  'suspended'
] as const;
export type EmployeeStatusValue = (typeof EMPLOYEE_STATUS_VALUES)[number];

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  SUSPENDED: 'suspended' as const
} as const;

export type EmployeeStatus =
  (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];
