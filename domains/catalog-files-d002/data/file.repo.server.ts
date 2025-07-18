import 'server-only';
import { eq, desc, and, sql, asc, ilike, or } from 'drizzle-orm';

import { db } from '@/shared/database/connection';

import { d002Files, NewFile } from '../model/files.schema';

export const fileRepository = {
  /**
   * Creates a new file record in the database.
   * @param newFile - The file data to insert.
   * @returns The newly created file record.
   */
  async createFile(newFile: NewFile) {
    const [result] = await db.insert(d002Files).values(newFile).returning();
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
      .from(d002Files)
      .where(and(eq(d002Files.id, id), eq(d002Files.isDeleted, false)))
      .limit(1);
    return result[0];
  },

  /**
   * Retrieves a list of files with pagination, search, and sorting.
   * By default, it returns only non-deleted files.
   * @param options - Options for pagination, filtering, search, and sorting.
   * @returns A list of file records.
   */
  async getFiles(options: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
    search?: string;
    sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      limit = 20,
      offset = 0,
      includeDeleted = false,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build where conditions
    const whereConditions = [];

    if (!includeDeleted) {
      whereConditions.push(eq(d002Files.isDeleted, false));
    }

    // Add search condition if provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions.push(
        or(
          ilike(d002Files.title, searchTerm),
          ilike(d002Files.description || '', searchTerm)
        )
      );
    }

    const whereCondition =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by condition
    let orderByCondition;
    switch (sortBy) {
      case 'title':
        orderByCondition =
          sortOrder === 'asc' ? asc(d002Files.title) : desc(d002Files.title);
        break;
      case 'description':
        orderByCondition =
          sortOrder === 'asc'
            ? asc(d002Files.description)
            : desc(d002Files.description);
        break;
      case 'mimeType':
        orderByCondition =
          sortOrder === 'asc'
            ? asc(d002Files.mimeType)
            : desc(d002Files.mimeType);
        break;
      case 'fileSize':
        orderByCondition =
          sortOrder === 'asc'
            ? asc(d002Files.fileSize)
            : desc(d002Files.fileSize);
        break;
      case 'createdAt':
      default:
        orderByCondition =
          sortOrder === 'asc'
            ? asc(d002Files.createdAt)
            : desc(d002Files.createdAt);
        break;
    }

    return db
      .select()
      .from(d002Files)
      .where(whereCondition)
      .orderBy(orderByCondition)
      .limit(limit)
      .offset(offset);
  },

  /**
   * Marks a file as deleted (soft delete).
   * @param id - The UUID of the file to delete.
   * @param deletedBy - The UUID of the user who deleted the file.
   * @returns The updated file record.
   */
  async softDeleteFile(id: string, deletedBy?: string) {
    const updateData: any = {
      isDeleted: true,
      updatedAt: new Date(),
      deletedAt: new Date()
    };

    if (deletedBy) {
      updateData.deletedBy = deletedBy;
    }

    const [result] = await db
      .update(d002Files)
      .set(updateData)
      .where(eq(d002Files.id, id))
      .returning();
    return result;
  },

  /**
   * Updates a file's metadata.
   * @param id - The UUID of the file to update.
   * @param data - The new data for the file.
   * @param updatedBy - The UUID of the user who updated the file.
   * @returns The updated file record.
   */
  async updateFile(
    id: string,
    data: Partial<Pick<NewFile, 'title' | 'description'>>,
    updatedBy?: string
  ) {
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
      version: sql`${d002Files.version} + 1`
    };

    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    const [result] = await db
      .update(d002Files)
      .set(updateData)
      .where(eq(d002Files.id, id))
      .returning();
    return result;
  }
};
