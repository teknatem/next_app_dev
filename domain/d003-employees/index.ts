//
// КЛИЕНТСКИЙ ИНДЕКС
// Здесь мы экспортируем только то, что безопасно для использования на клиенте.
//

// Shared types & schemas
export type { Employee, EmployeeSearch, EmployeeUpdate } from './types.shared';

// Shared enums (client-safe)
export { EMPLOYEE_STATUS_VALUES, EMPLOYEE_STATUS } from './model/enums.shared';
export type { EmployeeStatusValue, EmployeeStatus } from './model/enums.shared';

// Date utilities (shared)
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime,
  formatDateDDMMYYYY
} from './lib/date-utils.shared';

// UI Components (re-export from ui barrel)
export * from './ui';
