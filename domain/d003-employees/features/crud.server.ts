import 'server-only';

import { revalidatePath } from 'next/cache';
import {
  createEmployeeAction,
  deactivateEmployeeAction,
  updateEmployeeAction
} from '../actions/crud.actions.server';

/**
 * Saves (creates or updates) an employee.
 * Public server action used by client-side forms.
 */
export async function saveEmployee(formData: FormData) {
  'use server';
  const employeeId = formData.get('employeeId') as string;

  if (employeeId) {
    await updateEmployeeAction(formData);
  } else {
    await createEmployeeAction(formData);
  }
  revalidatePath('/employees');
}

/**
 * Soft-deletes (deactivates) an employee.
 * Public server action used by client-side forms.
 */
export async function deleteEmployee(formData: FormData) {
  'use server';
  const employeeId = formData.get('employeeId') as string;
  if (employeeId) {
    await deactivateEmployeeAction(formData);
    revalidatePath('/employees');
  }
}
