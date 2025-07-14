import 'server-only';
import { employeeRepositoryServer } from '../data/employee.repo.server';
import {
  insertEmployeeSchema,
  type NewEmployee
} from '../model/employees.schema';

export async function createEmployeeAction(formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: (formData.get('email') as string) || null,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
      isActive: formData.get('isActive') === 'true'
    };

    const validatedData = insertEmployeeSchema.parse(rawData);
    const employee = await employeeRepositoryServer.create(validatedData);

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployeeAction(id: string, formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: (formData.get('email') as string) || null,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
      isActive: formData.get('isActive') === 'true'
    };

    const validatedData = insertEmployeeSchema.partial().parse(rawData);
    const employee = await employeeRepositoryServer.update(id, validatedData);

    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deactivateEmployeeAction(id: string) {
  try {
    const success = await employeeRepositoryServer.softDelete(id);

    if (!success) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deactivating employee:', error);
    return { success: false, error: 'Failed to deactivate employee' };
  }
}

export async function getEmployeesAction() {
  try {
    const employees = await employeeRepositoryServer.getAll();
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { success: false, error: 'Failed to fetch employees' };
  }
}

export async function getEmployeeByIdAction(id: string) {
  try {
    const employee = await employeeRepositoryServer.getById(id);

    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { success: false, error: 'Failed to fetch employee' };
  }
}

export async function searchEmployeesAction(
  query?: string,
  department?: string,
  isActive?: boolean
) {
  try {
    const employees = await employeeRepositoryServer.search(
      query,
      department,
      isActive
    );
    return { success: true, data: employees };
  } catch (error) {
    console.error('Error searching employees:', error);
    return { success: false, error: 'Failed to search employees' };
  }
}

export async function getDepartmentsAction() {
  try {
    const departments = await employeeRepositoryServer.getDepartments();
    return { success: true, data: departments };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { success: false, error: 'Failed to fetch departments' };
  }
}

export async function getPositionsAction() {
  try {
    const positions = await employeeRepositoryServer.getPositions();
    return { success: true, data: positions };
  } catch (error) {
    console.error('Error fetching positions:', error);
    return { success: false, error: 'Failed to fetch positions' };
  }
}
