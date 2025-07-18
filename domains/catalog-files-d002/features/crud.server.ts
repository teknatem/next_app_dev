'use server';

import { revalidatePath } from 'next/cache';

import { fileActions } from '../actions/crud.actions.server';

/**
 * Создать новый файл (Server Action)
 */
export async function createFile(formData: FormData) {
  const result = await fileActions.createFileAction(formData);

  if (result.success) {
    revalidatePath('/files');
  }

  return result;
}

/**
 * Обновить файл (Server Action)
 */
export async function updateFile(id: string, formData: FormData) {
  const result = await fileActions.updateFileAction(id, formData);

  if (result.success) {
    revalidatePath('/files');
    revalidatePath(`/files/${id}`);
  }

  return result;
}

/**
 * Мягкое удаление файла (Server Action)
 */
export async function softDeleteFile(id: string) {
  const result = await fileActions.softDeleteFileAction(id);

  if (result.success) {
    revalidatePath('/files');
    revalidatePath(`/files/${id}`);
  }

  return result;
}

/**
 * Получить файл по ID (Server Action)
 */
export async function getFileById(id: string) {
  return await fileActions.getFileByIdAction(id);
}

/**
 * Получить список файлов (Server Action)
 */
export async function getFiles(options: {
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
  search?: string;
  sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) {
  return await fileActions.getFilesAction(options);
}

/**
 * Получить pre-signed URL для загрузки (Server Action)
 */
export async function getPresignedUploadUrl(
  mimeType: string,
  fileSize: number,
  folder?: string
) {
  return await fileActions.getPresignedUploadUrlAction(
    mimeType,
    fileSize,
    folder
  );
}

/**
 * Получить pre-signed URL для чтения (Server Action)
 */
export async function getPresignedReadUrl(s3Key: string) {
  return await fileActions.getPresignedReadUrlAction(s3Key);
}

/**
 * Тестировать конфигурацию S3 (Server Action)
 */
export async function testS3Configuration() {
  return await fileActions.testS3ConfigurationAction();
}
