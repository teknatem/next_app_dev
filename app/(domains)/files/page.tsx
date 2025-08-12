import {
  testS3Configuration,
  getPresignedUploadUrlAction,
  createFile,
  getFiles,
  softDeleteFile,
  updateFile
} from '@/domain/d002-files/index.server';
import { FilesPageClient } from '@/domain/d002-files';

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
