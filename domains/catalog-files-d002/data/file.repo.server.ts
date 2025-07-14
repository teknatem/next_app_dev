import 'server-only';
import { eq, desc, and } from 'drizzle-orm';

import { db } from '@/shared/database/connection';

import { files, NewFile } from '../model/files.schema';

export const fileRepository = {
  /**
   * Creates a new file record in the database.
   * @param newFile - The file data to insert.
   * @returns The newly created file record.
   */
  async createFile(newFile: NewFile) {
    const [result] = await db.insert(files).values(newFile).returning();
    return result;
  },

  /**
   * Retrieves a file by its ID.
   * @param id - The UUID of the file.
   * @returns The file record or undefined if not found.
   */
  async getFileById(id: string) {
    const result = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.isDeleted, false)))
      .limit(1);
    return result[0];
  },

  /**
   * Retrieves a list of files with pagination.
   * By default, it returns only non-deleted files.
   * @param options - Options for pagination and filtering.
   * @returns A list of file records.
   */
  async getFiles(options: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  }) {
    const { limit = 20, offset = 0, includeDeleted = false } = options;

    const whereCondition =
      includeDeleted === true ? undefined : eq(files.isDeleted, false);

    return db
      .select()
      .from(files)
      .where(whereCondition)
      .orderBy(desc(files.createdAt))
      .limit(limit)
      .offset(offset);
  },

  /**
   * Marks a file as deleted (soft delete).
   * @param id - The UUID of the file to delete.
   * @returns The updated file record.
   */
  async softDeleteFile(id: string) {
    const [result] = await db
      .update(files)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return result;
  },

  /**
   * Updates a file's metadata.
   * @param id - The UUID of the file to update.
   * @param data - The new data for the file.
   * @returns The updated file record.
   */
  async updateFile(
    id: string,
    data: Partial<Pick<NewFile, 'title' | 'description'>>
  ) {
    const [result] = await db
      .update(files)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return result;
  }
};
