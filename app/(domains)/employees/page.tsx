import {
  getDepartmentsAction,
  getEmployeesAction,
  getPositionsAction,
  saveEmployee,
  deleteEmployee
} from '@/domains/catalog-employees-d003/index.server';
import { EmployeeList } from '@/domains/catalog-employees-d003';

export default async function EmployeesPage() {
  const [employeesResult, departmentsResult, positionsResult] =
    await Promise.all([
      getEmployeesAction(),
      getDepartmentsAction(),
      getPositionsAction()
    ]);

  const employees = employeesResult.success ? employeesResult.data || [] : [];
  const departments = departmentsResult.success
    ? departmentsResult.data || []
    : [];
  const positions = positionsResult.success ? positionsResult.data || [] : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Управление сотрудниками</h1>
      <EmployeeList
        employees={employees}
        departments={departments}
        positions={positions}
        saveAction={saveEmployee}
        deleteAction={deleteEmployee}
      />
    </div>
  );
}
