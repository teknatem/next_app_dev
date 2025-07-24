import 'server-only';

// Server-only ORM exports (includes validation schemas)
export * from './orm.server';
// Shared exports
export * from './types.shared';
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime
} from './lib/date-utils';

// Server-only data layer
export { fileRepository } from './data/file.repo.server';

// Server-only services
export {
  getPresignedUploadUrl,
  getPresignedReadUrl
} from './lib/s3.service.server';

// Server Actions (orchestrators)
export {
  createFile,
  updateFile,
  softDeleteFile,
  getFileById,
  getFiles,
  getPresignedUploadUrl as getPresignedUploadUrlAction,
  getPresignedReadUrl as getPresignedReadUrlAction,
  testS3Configuration
} from './features/crud.server';
