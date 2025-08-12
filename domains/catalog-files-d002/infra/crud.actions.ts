'use server';

import { revalidatePath } from 'next/cache';

import { fileRepository } from './file.repo.server';
import {
  getPresignedUploadUrl,
  getPresignedReadUrl
} from './s3.service.server';
import { formFileSchema, updateFileSchema } from '../types.shared';

/**
 * Create a new file record after upload to S3
 */
export async function createFile(formData: FormData): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const descriptionValue = formData.get('description');
    const metadataValue = formData.get('metadata');
    const rawData = {
      title: (formData.get('title') as string) ?? '',
      description:
        typeof descriptionValue === 'string' ? descriptionValue : undefined,
      mimeType: (formData.get('mimeType') as string) ?? '',
      fileSize: Number(formData.get('fileSize') ?? 0),
      s3Key: (formData.get('s3Key') as string) ?? '',
      url: (formData.get('url') as string) ?? '',
      metadata:
        typeof metadataValue === 'string'
          ? (metadataValue as string)
          : undefined
    };

    const validatedData = formFileSchema.parse(rawData);
    const newFile = await fileRepository.createFile(validatedData);

    revalidatePath('/files');

    return { success: true, data: newFile };
  } catch (error) {
    console.error('Error creating file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create file'
    };
  }
}

/**
 * Update an existing file
 */
export async function updateFile(
  id: string,
  formData: FormData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string
    };

    const validatedData = updateFileSchema.parse(rawData);
    const updatedFile = await fileRepository.updateFile(id, validatedData);

    revalidatePath('/files');
    revalidatePath(`/files/${id}`);

    return { success: true, data: updatedFile };
  } catch (error) {
    console.error('Error updating file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update file'
    };
  }
}

/**
 * Soft delete a file
 */
export async function softDeleteFile(
  id: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const deletedFile = await fileRepository.softDeleteFile(id);

    revalidatePath('/files');
    revalidatePath(`/files/${id}`);

    return { success: true, data: deletedFile };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file'
    };
  }
}

/** Get file by id */
export async function getFileById(
  id: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const file = await fileRepository.getFileById(id);
    if (!file) {
      return { success: false, error: 'File not found' };
    }
    return { success: true, data: file };
  } catch (error) {
    console.error('Error fetching file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch file'
    };
  }
}

/** Get files list */
export async function getFiles(options: {
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
  search?: string;
  sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  mimeType?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const files = await fileRepository.getFiles(options);
    return { success: true, data: files };
  } catch (error) {
    console.error('Error fetching files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch files'
    };
  }
}

/** Get images only */
export async function getImagesAction(options: {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await getFiles({
      ...options,
      mimeType: 'image/',
      includeDeleted: false
    });
    if (!result.success) return result;
    const files = (result.data as any[]).filter((f) =>
      String(f?.mimeType || '').startsWith('image/')
    );
    return { success: true, data: files };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch images'
    };
  }
}

/** Get presigned upload URL */
export async function getPresignedUploadUrlAction(
  mimeType: string,
  fileSize: number,
  folder?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await getPresignedUploadUrl(mimeType, fileSize, folder);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting presigned upload URL:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get presigned upload URL'
    };
  }
}

/** Get presigned read URL */
export async function getPresignedReadUrlAction(
  s3Key: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = await getPresignedReadUrl(s3Key);
    return { success: true, data: { url } };
  } catch (error) {
    console.error('Error getting presigned read URL:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get presigned read URL'
    };
  }
}
