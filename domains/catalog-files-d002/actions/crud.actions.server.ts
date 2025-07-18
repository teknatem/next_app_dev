import 'server-only';

import { revalidatePath } from 'next/cache';

import { fileRepository } from '../data/file.repo.server';
import {
  getPresignedUploadUrl,
  getPresignedReadUrl
} from '../lib/s3.service.server';
import {
  NewFile,
  insertFileSchema,
  updateFileSchema,
  formFileSchema
} from '../model/files.schema';

export const fileActions = {
  /**
   * Создать новый файл
   */
  async createFileAction(
    formData: FormData
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const rawData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        mimeType: formData.get('mimeType') as string,
        fileSize: Number(formData.get('fileSize')),
        s3Key: formData.get('s3Key') as string,
        url: formData.get('url') as string,
        metadata: formData.get('metadata') as string
      };

      const validatedData = formFileSchema.parse(rawData);
      const newFile = await fileRepository.createFile(validatedData);

      return { success: true, data: newFile };
    } catch (error) {
      console.error('Error creating file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create file'
      };
    }
  },

  /**
   * Обновить файл
   */
  async updateFileAction(
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

      return { success: true, data: updatedFile };
    } catch (error) {
      console.error('Error updating file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update file'
      };
    }
  },

  /**
   * Мягкое удаление файла
   */
  async softDeleteFileAction(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const deletedFile = await fileRepository.softDeleteFile(id);
      return { success: true, data: deletedFile };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      };
    }
  },

  /**
   * Получить файл по ID
   */
  async getFileByIdAction(
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
  },

  /**
   * Получить список файлов
   */
  async getFilesAction(options: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
    search?: string;
    sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
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
  },

  /**
   * Получить pre-signed URL для загрузки
   */
  async getPresignedUploadUrlAction(
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
  },

  /**
   * Получить pre-signed URL для чтения
   */
  async getPresignedReadUrlAction(
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
  },

  /**
   * Test S3 configuration and connectivity
   */
  async testS3ConfigurationAction(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // Test 1: Check environment variables
      const requiredEnvVars = [
        'S3_ENDPOINT',
        'S3_REGION',
        'S3_BUCKET_NAME',
        'S3_ACCESS_KEY_ID',
        'S3_SECRET_ACCESS_KEY'
      ];

      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        return {
          success: false,
          error: `Missing environment variables: ${missingVars.join(', ')}`
        };
      }

      // Test 2: Test S3 client connection
      const { S3Client, HeadBucketCommand } = await import(
        '@aws-sdk/client-s3'
      );

      const s3Client = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
        }
      });

      // Test 3: Check if bucket exists and is accessible
      const headBucketCommand = new HeadBucketCommand({
        Bucket: process.env.S3_BUCKET_NAME
      });

      await s3Client.send(headBucketCommand);

      // Test 4: Try to generate a presigned URL (this tests the full flow)
      const { getPresignedUploadUrl } = await import(
        '../lib/s3.service.server'
      );
      const testUrl = await getPresignedUploadUrl('text/plain', 1024, 'test');

      return {
        success: true,
        data: {
          message: 'S3 configuration is working correctly',
          details: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            bucket: process.env.S3_BUCKET_NAME,
            presignedUrlGenerated: !!testUrl.url,
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      console.error('S3 configuration test failed:', error);

      let errorMessage = 'S3 configuration test failed';
      let details = '';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide more specific error messages
        if (error.message.includes('NoSuchBucket')) {
          details =
            'The specified bucket does not exist. Please check your S3_BUCKET_NAME.';
        } else if (error.message.includes('AccessDenied')) {
          details =
            'Access denied. Please check your S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY.';
        } else if (error.message.includes('InvalidAccessKeyId')) {
          details = 'Invalid access key. Please check your S3_ACCESS_KEY_ID.';
        } else if (error.message.includes('SignatureDoesNotMatch')) {
          details =
            'Invalid secret key. Please check your S3_SECRET_ACCESS_KEY.';
        } else if (
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ECONNREFUSED')
        ) {
          details =
            'Cannot connect to S3 endpoint. Please check your S3_ENDPOINT and network connectivity.';
        }
      }

      return {
        success: false,
        error: errorMessage,
        data: { details }
      };
    }
  }
};
