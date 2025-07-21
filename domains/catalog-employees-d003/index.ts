//
// КЛИЕНТСКИЙ ИНДЕКС
// Здесь мы экспортируем только то, что безопасно для использования на клиенте.
//

// Shared types & schemas
//export * from './model/employees.schema';

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
  getActiveEmployeesAction,
  searchEmployeesAction as searchEmployeesClientAction,
  getDepartmentsAction,
  getPositionsAction
} from './actions/client-server.actions';

// UI Components
export { EmployeeList } from './ui/employees.list.client';
export { EmployeeDetails } from './ui/employees.details.client';
export { EmployeePicker } from './ui/employees.picker.client';
