'use server';

import { employeeRepositoryServer } from '../data/employee.repo.server';
import { Employee } from '../orm.server';

/**
 * Server action для получения списка активных сотрудников (может быть вызван из клиента)
 */
export async function getActiveEmployeesAction(): Promise<{
  success: boolean;
  data?: Employee[];
  error?: string;
}> {
  try {
    const employees = await employeeRepositoryServer.search(
      undefined,
      undefined,
      true // только активные
    );
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error fetching active employees:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch employees'
    };
  }
}

/**
 * Server action для поиска сотрудников (может быть вызван из клиента)
 */
export async function searchEmployeesAction(options: {
  query?: string;
  department?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; data?: Employee[]; error?: string }> {
  try {
    const employees = await employeeRepositoryServer.search(
      options.query,
      options.department,
      options.isActive
    );
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error searching employees:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to search employees'
    };
  }
}

/**
 * Server action для получения списка отделов (может быть вызван из клиента)
 */
export async function getDepartmentsAction(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    const departments = await employeeRepositoryServer.getDepartments();
    return { success: true, data: departments };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch departments'
    };
  }
}

/**
 * Server action для получения списка должностей (может быть вызван из клиента)
 */
export async function getPositionsAction(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    const positions = await employeeRepositoryServer.getPositions();
    return { success: true, data: positions };
  } catch (error) {
    console.error('Error fetching positions:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch positions'
    };
  }
}
