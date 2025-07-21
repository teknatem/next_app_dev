import 'server-only';

// Shared types & schemas
export * from './orm.server';
export * from './types.shared';

// Date utilities (shared)
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime,
  formatDateDDMMYYYY
} from './lib/date-utils';

// Server-only data layer
export { employeeRepositoryServer } from './data/employee.repo.server';

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
