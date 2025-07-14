import 'server-only';

// Server-only exports
export * from './model/employees.schema';
export { employeeRepositoryServer } from './data/employee.repo.server';
export {
  createEmployeeAction,
  updateEmployeeAction,
  deactivateEmployeeAction,
  getEmployeesAction,
  getEmployeeByIdAction,
  searchEmployeesAction,
  getDepartmentsAction,
  getPositionsAction
} from './actions/employee-actions.server';
export {
  saveEmployee,
  deleteEmployee
} from './features/manage-employees.server';
