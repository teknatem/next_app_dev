import { z } from 'zod';

// Базовый тип файла для клиентских компонентов
export type File = {
  id: string;
  title: string;
  description: string | null;
  mimeType: string;
  fileSize: number;
  url: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  // Опциональные поля для отображения
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  metadata?: Record<string, any> | null;
  version?: number;
};

// ZOD схемы для валидации (независимые от ORM)
export const fileSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().min(0),
  s3Key: z.string().min(1).max(1024),
  url: z.string().url().max(2048),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  mimeType: z.string().min(1).max(127),
  fileSize: z.number().positive(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid().nullable(),
  updatedBy: z.string().uuid().nullable(),
  deletedAt: z.date().nullable(),
  deletedBy: z.string().uuid().nullable(),
  metadata: z.record(z.any()).nullable()
});

export const insertFileSchema = fileSchema
  .omit({
    id: true,
    version: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
    deletedAt: true,
    deletedBy: true
  })
  .partial({
    createdBy: true,
    updatedBy: true,
    description: true,
    metadata: true
  });

export const selectFileSchema = fileSchema;

// Кастомные схемы для форм
export const formFileSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  mimeType: z.string().min(1).max(127),
  fileSize: z.number().positive(),
  s3Key: z.string().min(1).max(1024),
  url: z.string().url().max(2048),
  metadata: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        throw new Error('Invalid metadata format. Must be valid JSON.');
      }
    })
});

export const updateFileSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  version: z.number().int().positive()
});

// Типы для использования
export type FileData = z.infer<typeof fileSchema>;
export type NewFileData = z.infer<typeof insertFileSchema>;
export type FormFileData = z.infer<typeof formFileSchema>;
export type UpdateFileData = z.infer<typeof updateFileSchema>;
