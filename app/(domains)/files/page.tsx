import {
  testS3Configuration,
  getPresignedUploadUrlAction,
  createFile,
  getFiles,
  softDeleteFile,
  updateFile
} from '@/domains/catalog-files-d002/index.server';
import { FilesPageClient } from '@/domains/catalog-files-d002';

export default function FileManagerPage() {
  return (
    <FilesPageClient
      testS3ConfigurationAction={testS3Configuration}
      getPresignedUploadUrlAction={getPresignedUploadUrlAction}
      createFileAction={createFile}
      getFilesAction={getFiles}
      softDeleteFileAction={softDeleteFile}
      updateFileAction={updateFile}
    />
  );
}
