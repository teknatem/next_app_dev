'use server';

import { fileRepository } from '../data/file.repo.server';
import { File as FileRecord } from '../types.shared';

/**
 * Server action для получения изображений (может быть вызван из клиента)
 */
export async function getImagesAction(options: {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ success: boolean; data?: FileRecord[]; error?: string }> {
  try {
    const files = await fileRepository.getFiles({
      ...options,
      mimeType: 'image/', // Только изображения
      includeDeleted: false // Не включать удаленные файлы
    });

    // Фильтруем только изображения для дополнительной безопасности
    const images = files.filter((f: FileRecord) =>
      f.mimeType.startsWith('image/')
    );

    return { success: true, data: images };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch images'
    };
  }
}
