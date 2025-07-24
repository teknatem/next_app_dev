// Domain-specific enums for catalog-employees-d003
// Following FSDDD rules for client-server compatibility

export const EMPLOYEE_STATUS_VALUES = [
  'active',
  'inactive',
  'suspended'
] as const;
export type EmployeeStatusValue = (typeof EMPLOYEE_STATUS_VALUES)[number];

// Export for both client and server use
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  SUSPENDED: 'suspended' as const
} as const;

export type EmployeeStatus =
  (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];
