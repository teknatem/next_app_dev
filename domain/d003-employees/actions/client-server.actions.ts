'use server';

import {
  searchEmployeesAction as searchEmployeesActionServer,
  getDepartmentsAction as getDepartmentsActionServer,
  getPositionsAction as getPositionsActionServer
} from './crud.actions.server';
import type { Employee } from '../types.shared';

/**
 * Client-accessible server action для поиска сотрудников
 */
export async function searchEmployeesAction(options: {
  query?: string;
  department?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; data?: Employee[]; error?: string }> {
  return searchEmployeesActionServer(options);
}

/**
 * Client-accessible server action для получения списка отделов
 */
export async function getDepartmentsAction(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  return getDepartmentsActionServer();
}

/**
 * Client-accessible server action для получения списка должностей
 */
export async function getPositionsAction(): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  return getPositionsActionServer();
}
