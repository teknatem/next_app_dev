import 'server-only';
import {
  employeeRepositoryServer,
  OptimisticLockError
} from '../data/employee.repo.server';
import { insertEmployeeSchema, updateEmployeeSchema } from '../types.shared';
import { type NewEmployee } from '../orm.server';
import { auth } from '@/shared/lib/auth';

export async function createEmployeeAction(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const rawData = {
      fullName: formData.get('fullName') as string,
      email: (formData.get('email') as string) || null,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
      isActive: formData.get('isActive') === 'true',
      status: (formData.get('status') as string) || 'active',
      metadata: formData.get('metadata')
        ? JSON.parse(formData.get('metadata') as string)
        : null
    };

    const validatedData = insertEmployeeSchema.parse(rawData);
    const employee = await employeeRepositoryServer.create(
      validatedData,
      userId
    );

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployeeAction(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const rawData = {
      id: formData.get('id') as string,
      version: parseInt(formData.get('version') as string),
      fullName: formData.get('fullName') as string,
      email: (formData.get('email') as string) || null,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
      isActive: formData.get('isActive') === 'true',
      status: (formData.get('status') as string) || 'active',
      metadata: formData.get('metadata')
        ? JSON.parse(formData.get('metadata') as string)
        : undefined
    };

    const validatedData = updateEmployeeSchema.parse(rawData);
    const { id, version, ...updateData } = validatedData;

    const employee = await employeeRepositoryServer.update(
      id,
      updateData,
      version,
      userId
    );

    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error updating employee:', error);

    if (error instanceof OptimisticLockError) {
      return {
        success: false,
        error: error.message,
        type: 'OPTIMISTIC_LOCK_ERROR'
      };
    }

    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deactivateEmployeeAction(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const id = formData.get('id') as string;
    const version = parseInt(formData.get('version') as string);

    const success = await employeeRepositoryServer.softDelete(
      id,
      version,
      userId
    );

    if (!success) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deactivating employee:', error);

    if (error instanceof OptimisticLockError) {
      return {
        success: false,
        error: error.message,
        type: 'OPTIMISTIC_LOCK_ERROR'
      };
    }

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
