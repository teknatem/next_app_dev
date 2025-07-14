import 'server-only';

import { revalidatePath } from 'next/cache';
import {
  createEmployeeAction,
  deactivateEmployeeAction,
  updateEmployeeAction
} from '../actions/employee-actions.server';

/**
 * Orchestrates saving (creating or updating) an employee.
 * This is a server action that can be passed to client components.
 */
export async function saveEmployee(formData: FormData) {
  'use server';
  const employeeId = formData.get('employeeId') as string;

  if (employeeId) {
    await updateEmployeeAction(employeeId, formData);
  } else {
    await createEmployeeAction(formData);
  }
  revalidatePath('/employees');
}

/**
 * Orchestrates deactivating an employee.
 * This is a server action that can be passed to client components.
 */
export async function deleteEmployee(formData: FormData) {
  'use server';
  const employeeId = formData.get('employeeId') as string;
  if (employeeId) {
    await deactivateEmployeeAction(employeeId);
    revalidatePath('/employees');
  }
}
