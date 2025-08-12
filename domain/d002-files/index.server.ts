import 'server-only';

// Server-only ORM exports (includes validation schemas)
export * from './infra/orm.server';
// Shared exports
export * from './types.shared';
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime
} from './lib/date-utils.shared';

// Server-only data layer
export { fileRepository } from './infra/file.repo.server';

// Server-only services
export {
  getPresignedUploadUrl,
  getPresignedReadUrl
} from './infra/s3.service.server';

// Server Actions (infra)
export {
  createFile,
  updateFile,
  softDeleteFile,
  getFileById,
  getFiles,
  getImagesAction,
  getPresignedUploadUrlAction,
  getPresignedReadUrlAction
} from './infra/crud.actions';
export { testS3Configuration } from './infra/test-s3.actions';

// Note: ImagePicker is now a client-only widget. No server wrapper exports.

export { AGGREGATE_ID, AGGREGATE_SLUG } from './meta.shared';
