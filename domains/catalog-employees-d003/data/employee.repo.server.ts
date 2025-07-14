import 'server-only';
import { eq, like, and, desc } from 'drizzle-orm';
import { db } from '@/shared/database/connection';
import {
  employees,
  type Employee,
  type NewEmployee
} from '../model/employees.schema';

export const employeeRepositoryServer = {
  // Получить всех сотрудников (не удаленных)
  async getAll(): Promise<Employee[]> {
    return await db
      .select()
      .from(employees)
      .where(eq(employees.isDeleted, false))
      .orderBy(desc(employees.createdAt));
  },

  // Получить сотрудника по ID (не удаленного)
  async getById(id: string): Promise<Employee | null> {
    const result = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.isDeleted, false)));
    return result[0] || null;
  },

  // Поиск сотрудников (не удаленных)
  async search(
    query?: string,
    department?: string,
    isActive?: boolean
  ): Promise<Employee[]> {
    const conditions = [eq(employees.isDeleted, false)];

    if (query) {
      conditions.push(like(employees.fullName, `%${query}%`));
    }

    if (department) {
      conditions.push(eq(employees.department, department));
    }

    if (isActive !== undefined) {
      conditions.push(eq(employees.isActive, isActive));
    }

    const whereClause = and(...conditions);

    return await db
      .select()
      .from(employees)
      .where(whereClause)
      .orderBy(desc(employees.createdAt));
  },

  // Создать нового сотрудника
  async create(data: NewEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(data).returning();
    return result[0];
  },

  // Обновить сотрудника
  async update(
    id: string,
    data: Partial<NewEmployee>
  ): Promise<Employee | null> {
    const result = await db
      .update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return result[0] || null;
  },

  // Мягкое удаление сотрудника (установка флага isDeleted)
  async softDelete(id: string): Promise<boolean> {
    const result = await db
      .update(employees)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return result.length > 0;
  },

  // Получить уникальные отделы (не удаленных сотрудников)
  async getDepartments(): Promise<string[]> {
    const result = await db
      .select({ department: employees.department })
      .from(employees)
      .where(eq(employees.isDeleted, false));
    return Array.from(new Set(result.map((r) => r.department))).sort();
  },

  // Получить уникальные должности (не удаленных сотрудников)
  async getPositions(): Promise<string[]> {
    const result = await db
      .select({ position: employees.position })
      .from(employees)
      .where(eq(employees.isDeleted, false));
    return Array.from(new Set(result.map((r) => r.position))).sort();
  }
};
