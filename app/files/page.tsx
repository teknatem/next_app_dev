'use client';

import { useState } from 'react';
import { File } from '@/domains/catalog-files-d002/model/files.schema';
import { FileUploader } from '@/domains/catalog-files-d002/ui/file-uploader';
import { FileList } from '@/domains/catalog-files-d002/ui/file-list';
import { FileDetails } from '@/domains/catalog-files-d002/ui/file-details';
import { FilePicker } from '@/domains/catalog-files-d002/ui/file-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

export default function FileManagerPage() {
  // State to force re-render of FileList after upload
  const [uploadVersion, setUploadVersion] = useState(0);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const testS3Configuration = async () => {
    setTestingS3(true);
    try {
      const response = await fetch('/api/files-d002/test-s3');
      const result = await response.json();
      setS3TestResult(result);
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
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">File Management</h1>

      {/* S3 Configuration Test Section */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-yellow-800">
          S3 Configuration Test
        </h2>
        <p className="text-sm text-yellow-700 mb-3">
          If you're experiencing upload errors, test your S3 configuration
          first.
        </p>
        <Button
          onClick={testS3Configuration}
          disabled={testingS3}
          variant="outline"
          size="sm"
        >
          {testingS3 ? 'Testing...' : 'Test S3 Configuration'}
        </Button>

        {s3TestResult && (
          <div
            className={`mt-3 p-3 rounded ${s3TestResult.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            <p className="font-medium">{s3TestResult.message}</p>
            {s3TestResult.status === 'error' && (
              <details className="mt-2">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="text-xs mt-1 whitespace-pre-wrap">
                  {JSON.stringify(s3TestResult, null, 2)}
                </pre>
              </details>
            )}
            {s3TestResult.status === 'success' && s3TestResult.config && (
              <div className="text-xs mt-2">
                <p>Endpoint: {s3TestResult.config.endpoint}</p>
                <p>Region: {s3TestResult.config.region}</p>
                <p>Bucket: {s3TestResult.config.bucket}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upload New File</h2>
        <FileUploader
          onUploadSuccess={handleUploadSuccess}
          folder="documents"
          debug={true}
        />
      </section>

      <section>
        {/* We pass a key to FileList to force a re-render when a file is uploaded */}
        <FileList key={uploadVersion} onFileEdit={handleEditFile} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">File Picker Example</h2>
        <FilePicker onFileSelect={(file: File) => setSelectedFile(file)} />
        {selectedFile && (
          <div className="mt-4 p-4 border rounded-lg bg-muted">
            <p>
              <strong>File Picked:</strong> {selectedFile.title}
            </p>
            <p className="text-sm text-muted-foreground">
              ID: {selectedFile.id}
            </p>
          </div>
        )}
      </section>

      {/* Dialog for editing file details */}
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
            <FileDetails file={editingFile} onClose={handleCloseDetails} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
