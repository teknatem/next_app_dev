import 'server-only';

// Shared types & schemas
export { d003Employees } from './infra/orm.server';
export type { Employee, NewEmployee } from './types.shared';

// Date utilities (shared)
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime,
  formatDateDDMMYYYY
} from './lib/date-utils.shared';

// Server-only data layer
export {
  employeeRepositoryServer,
  OptimisticLockError
} from './data/employee.repo.server';

// Server Actions (raw + orchestrators)
export {
  createEmployeeAction,
  updateEmployeeAction,
  deactivateEmployeeAction,
  getEmployeesAction,
  getEmployeeByIdAction,
  searchEmployeesAction,
  getDepartmentsAction,
  getPositionsAction,
  saveEmployee,
  deleteEmployee
} from './infra/crud.actions';

// Re-exporting enums and pgEnum
export { employeeStatusEnum } from './infra/orm.server';
export { EMPLOYEE_STATUS_VALUES, EMPLOYEE_STATUS } from './model/enums.shared';
export type { EmployeeStatusValue, EmployeeStatus } from './model/enums.shared';
