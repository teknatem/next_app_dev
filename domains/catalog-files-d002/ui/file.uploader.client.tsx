'use client';

import { useTransition } from 'react';
import { useState, ChangeEvent } from 'react';
import { z } from 'zod';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Progress } from '@/shared/ui/progress';

import { type File as D002File } from '../model/files.schema';
import { createFile, getPresignedUploadUrl } from '../features/crud.server';

const presignedUrlResponseSchema = z.object({
  url: z.string().url(),
  key: z.string()
});

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploaderProps {
  onUploadSuccess?: (file: D002File) => void;
  folder?: string;
  debug?: boolean;
  compact?: boolean;
}

export function FileUploader({
  onUploadSuccess,
  folder = 'general',
  debug = false,
  compact = false
}: FileUploaderProps) {
  const [file, setFile] = useState<globalThis.File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const log = (message: string) => {
    if (debug) {
      console.log('[FileUploader]', message);
      setDebugInfo(
        (prev) => prev + '\n' + new Date().toISOString() + ': ' + message
      );
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setStatus('idle');
      setError(null);
      setProgress(0);
      setDebugInfo('');
      log(
        `File selected: ${file.name}, type: ${file.type}, size: ${file.size}`
      );
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setError(null);
    log('Starting upload process...');

    startTransition(async () => {
      try {
        // 1. Get pre-signed URL using Server Action
        log('Step 1: Requesting pre-signed URL...');
        const presignedUrlResult = await getPresignedUploadUrl(
          file.type,
          file.size,
          folder
        );

        if (!presignedUrlResult.success || !presignedUrlResult.data) {
          log(`Pre-signed URL request failed: ${presignedUrlResult.error}`);
          throw new Error(
            presignedUrlResult.error || 'Failed to get pre-signed URL'
          );
        }

        const { url, key } = presignedUrlResponseSchema.parse(
          presignedUrlResult.data
        );
        log(`Pre-signed URL received: ${url.substring(0, 100)}...`);
        log(`S3 Key: ${key}`);

        // 2. Upload file to S3 with better error handling
        log('Step 2: Uploading to S3...');
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Test if we can reach the URL
          const urlObj = new URL(url);
          log(`Uploading to endpoint: ${urlObj.origin}`);

          xhr.open('PUT', url, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              setProgress(percentComplete);
              log(`Upload progress: ${percentComplete.toFixed(1)}%`);
            }
          };

          xhr.onload = () => {
            log(
              `Upload completed with status: ${xhr.status} ${xhr.statusText}`
            );
            if (xhr.status >= 200 && xhr.status < 300) {
              log('S3 upload successful');
              resolve();
            } else {
              log(`Upload failed. Response: ${xhr.responseText}`);
              reject(
                new Error(
                  `Upload failed with status: ${xhr.status} ${xhr.statusText}. Response: ${xhr.responseText}`
                )
              );
            }
          };

          xhr.onerror = (event) => {
            log(`Network error occurred: ${JSON.stringify(event)}`);
            log(`ReadyState: ${xhr.readyState}, Status: ${xhr.status}`);

            // Check if it's likely a CORS error
            const isCorsError = xhr.status === 0 || xhr.readyState === 0;
            if (isCorsError) {
              reject(
                new Error(
                  `CORS error: Your storage bucket is not configured to allow requests from this domain. Please configure CORS in your Yandex Cloud console. See CORS_FIX_GUIDE.md for detailed instructions.`
                )
              );
            } else {
              reject(
                new Error(
                  `Network error during upload. Check your S3 configuration and CORS settings. Status: ${xhr.status}`
                )
              );
            }
          };

          xhr.ontimeout = () => {
            log('Upload timeout occurred');
            reject(
              new Error('Upload timeout. The S3 endpoint may be unreachable.')
            );
          };

          // Set a timeout
          xhr.timeout = 60000; // 60 seconds

          log('Sending file to S3...');
          xhr.send(file);
        });

        // 3. Register file in our database using Server Action
        log('Step 3: Registering file in database...');
        const formData = new FormData();
        formData.append('s3Key', key);
        formData.append('url', url.split('?')[0]); // Store the base URL without query params
        formData.append('title', file.name);
        formData.append('mimeType', file.type);
        formData.append('fileSize', file.size.toString());

        const createFileResult = await createFile(formData);

        if (createFileResult.success && createFileResult.data) {
          const newFile = createFileResult.data;
          log('Step 4: File created in database');

          setStatus('success');
          onUploadSuccess?.(newFile);
          setFile(null); // Reset after success
        } else {
          throw new Error(createFileResult.error || 'Failed to register file');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          log(`Error occurred: ${err.message}`);
          setError(err.message || 'An unexpected error occurred.');
        } else {
          log('Error occurred: unknown error');
          setError('An unexpected error occurred.');
        }
        setStatus('error');
      }
    });
  };

  const uploading = status === 'uploading' || isPending;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Input type="file" onChange={handleFileChange} className="text-sm" />
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-dashed rounded-lg text-center">
      <Input type="file" onChange={handleFileChange} className="mb-4" />
      <Button
        onClick={handleUpload}
        disabled={status === 'uploading' || isPending}
        size="sm"
      >
        {status === 'uploading' ? `${progress.toFixed(0)}%` : 'Upload'}
      </Button>
    </div>
  );
}
