'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

import type { File } from '../../types.shared';
import { FileUploader } from '../file-uploader';
import { FileList } from '../file-list';
import { FileDetails } from '../file-details';

export function FilesPageClient(props: {
  testS3ConfigurationAction: () => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;
  getPresignedUploadUrlAction: (
    mimeType: string,
    fileSize: number,
    folder?: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  createFileAction: (
    formData: FormData
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  getFilesAction: (options: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
    search?: string;
    sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    mimeType?: string;
  }) => Promise<{ success: boolean; data?: File[]; error?: string }>;
  softDeleteFileAction: (
    id: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  updateFileAction: (
    id: string,
    formData: FormData
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
}) {
  const {
    testS3ConfigurationAction,
    getPresignedUploadUrlAction,
    createFileAction,
    getFilesAction,
    softDeleteFileAction,
    updateFileAction
  } = props;

  const [uploadVersion, setUploadVersion] = useState(0);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [s3TestResult, setS3TestResult] = useState<any>(null);
  const [testingS3, setTestingS3] = useState(false);

  const handleUploadSuccess = () => {
    setUploadVersion((v) => v + 1);
  };

  const handleEditFile = (file: File) => {
    setEditingFile(file);
  };

  const handleCloseDetails = () => {
    setEditingFile(null);
  };

  const handleFileUpdated = (updatedFile: File) => {
    setEditingFile(updatedFile);
    setUploadVersion((v) => v + 1);
  };

  const handleTestS3Configuration = async () => {
    setTestingS3(true);
    try {
      const result = await testS3ConfigurationAction();
      if (result.success) {
        setS3TestResult({
          status: 'success',
          message: result.data.message,
          details: result.data.details
        });
      } else {
        setS3TestResult({
          status: 'error',
          message: result.error || 'S3 configuration test failed',
          details: result.data?.details
        });
      }
    } catch (error) {
      setS3TestResult({
        status: 'error',
        message: 'Failed to test S3 configuration',
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setTestingS3(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/60 via-background/60 to-muted/10">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">File Management</h1>
          <Button
            onClick={handleTestS3Configuration}
            disabled={testingS3}
            variant="outline"
            size="sm"
          >
            {testingS3 ? 'Testing...' : 'Test S3 Configuration'}
          </Button>
        </div>

        {s3TestResult && (
          <section className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
            <div
              className={`p-3 rounded ${
                s3TestResult.status === 'success'
                  ? 'bg-green-100/80 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : s3TestResult.status === 'error'
                    ? 'bg-red-100/80 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    : 'bg-blue-100/80 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
              }`}
            >
              <p className="font-medium">{s3TestResult.message}</p>
              {s3TestResult.status === 'success' && s3TestResult.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    Configuration Details
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    <p>
                      <strong>Endpoint:</strong> {s3TestResult.details.endpoint}
                    </p>
                    <p>
                      <strong>Region:</strong> {s3TestResult.details.region}
                    </p>
                    <p>
                      <strong>Bucket:</strong> {s3TestResult.details.bucket}
                    </p>
                    <p>
                      <strong>Presigned URL:</strong>{' '}
                      {s3TestResult.details.presignedUrlGenerated
                        ? '✅ Generated'
                        : '❌ Failed'}
                    </p>
                    <p>
                      <strong>Test Time:</strong>{' '}
                      {s3TestResult.details.timestamp}
                    </p>
                  </div>
                </details>
              )}
              {s3TestResult.status === 'error' && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    Error Details
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    {s3TestResult.details && (
                      <p className="text-red-600 dark:text-red-400">
                        {s3TestResult.details}
                      </p>
                    )}
                    {s3TestResult.error && (
                      <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                        {s3TestResult.error}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </section>
        )}

        <section className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Upload New File</h2>
          <FileUploader
            onUploadSuccess={handleUploadSuccess}
            folder="documents"
            debug={false}
            onGetPresignedUploadUrlAction={getPresignedUploadUrlAction}
            onCreateFileAction={createFileAction}
          />
        </section>

        <section className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Files</h2>
          <FileList
            key={uploadVersion}
            onFileEdit={handleEditFile}
            getFilesAction={getFilesAction}
            softDeleteFileAction={softDeleteFileAction}
          />
        </section>

        <Dialog
          open={!!editingFile}
          onOpenChange={(isOpen) => !isOpen && handleCloseDetails()}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFile ? editingFile.title : 'File Details'}
              </DialogTitle>
            </DialogHeader>
            {editingFile && (
              <FileDetails
                file={editingFile}
                onClose={handleCloseDetails}
                onFileUpdated={handleFileUpdated}
                onUpdateFileAction={updateFileAction}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
