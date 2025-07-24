import 'server-only';

// Shared types & schemas
export { d003Employees } from './orm.server';
export type { Employee, NewEmployee } from './types.shared';

// Date utilities (shared)
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime,
  formatDateDDMMYYYY
} from './lib/date-utils';

// Server-only data layer
export {
  employeeRepositoryServer,
  OptimisticLockError
} from './data/employee.repo.server';

// Server Actions (raw business logic)
export {
  createEmployeeAction,
  updateEmployeeAction,
  deactivateEmployeeAction,
  getEmployeesAction,
  getEmployeeByIdAction,
  searchEmployeesAction,
  getDepartmentsAction,
  getPositionsAction
} from './actions/crud.actions.server';

// Server Actions (orchestrators)
export { saveEmployee, deleteEmployee } from './features/crud.server';

// Re-exporting enums
export {
  EMPLOYEE_STATUS_VALUES,
  EMPLOYEE_STATUS,
  employeeStatusEnum
} from './orm.server';
export type { EmployeeStatusValue, EmployeeStatus } from './model/enums';
