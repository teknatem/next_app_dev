//
// КЛИЕНТСКИЙ ИНДЕКС
// Здесь мы экспортируем только то, что безопасно для использования на клиенте.
//

// Shared types & schemas
export type { Employee, EmployeeSearch, EmployeeUpdate } from './types.shared';

// Shared enums (client-safe)
export { EMPLOYEE_STATUS_VALUES, EMPLOYEE_STATUS } from './model/enums';
export type { EmployeeStatusValue, EmployeeStatus } from './model/enums';

// Date utilities (shared)
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime,
  formatDateDDMMYYYY
} from './lib/date-utils';

// Client-accessible server actions
export {
  searchEmployeesAction,
  getDepartmentsAction,
  getPositionsAction
} from './actions/client-server.actions';

// UI Components
export { EmployeeList } from './ui/employees.list.client';
export { EmployeeDetails } from './ui/employees.details.client';
export { EmployeePicker } from './ui/employees.picker.client';
