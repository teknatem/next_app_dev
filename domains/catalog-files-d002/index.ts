// Client-safe barrel for catalog-files-d002 domain
export * from './model/files.schema';
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime
} from './lib/date-utils';

// UI Components (renamed to follow FSDDD conventions)
export { FileList } from './ui/file.list.client';
export { FileUploader } from './ui/file.uploader.client';
export { FileDetails } from './ui/file.details.client';
export { FilePicker } from './ui/file.picker.client';

// Server Actions (can be called from client components)
export { testS3Configuration } from './features/crud.server';
