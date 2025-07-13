// Client-safe barrel for catalog-files-d002 domain
export * from './model/files.schema';
export {
  toISOString,
  toDate,
  formatDate,
  formatDateTime
} from './lib/date-utils';
export { FileList } from './ui/file-list';
export { FileUploader } from './ui/file-uploader';
export { FileDetails } from './ui/file-details';
export { FilePicker } from './ui/file-picker';
// (добавить client API, если появится)
