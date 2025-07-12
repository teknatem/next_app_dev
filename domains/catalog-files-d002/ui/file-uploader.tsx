'use client';

import { useState, ChangeEvent } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { z } from 'zod';

const presignedUrlResponseSchema = z.object({
  url: z.string().url(),
  key: z.string()
});

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploaderProps {
  onUploadSuccess: (file: any) => void;
  folder?: string;
  debug?: boolean;
}

export function FileUploader({
  onUploadSuccess,
  folder = 'other',
  debug = false
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

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
      setSelectedFile(file);
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
    if (!selectedFile) return;

    setStatus('uploading');
    setError(null);
    log('Starting upload process...');

    try {
      // 1. Get pre-signed URL
      log('Step 1: Requesting pre-signed URL...');
      const presignedUrlRes = await fetch(
        '/api/files-d002/presigned-upload-url',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mimeType: selectedFile.type,
            fileSize: selectedFile.size,
            folder
          })
        }
      );

      if (!presignedUrlRes.ok) {
        const errorData = await presignedUrlRes.json();
        log(
          `Pre-signed URL request failed: ${presignedUrlRes.status} ${presignedUrlRes.statusText}`
        );
        throw new Error(errorData.message || 'Failed to get pre-signed URL');
      }

      const { url, key } = presignedUrlResponseSchema.parse(
        await presignedUrlRes.json()
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
        xhr.setRequestHeader('Content-Type', selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
            log(`Upload progress: ${percentComplete.toFixed(1)}%`);
          }
        };

        xhr.onload = () => {
          log(`Upload completed with status: ${xhr.status} ${xhr.statusText}`);
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
        xhr.send(selectedFile);
      });

      // 3. Register file in our database
      log('Step 3: Registering file in database...');
      const registerRes = await fetch('/api/files-d002', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          s3Key: key,
          url: url.split('?')[0], // Store the base URL without query params
          title: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size
        })
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        log(
          `Database registration failed: ${registerRes.status} ${registerRes.statusText}`
        );
        throw new Error(errorData.message || 'Failed to register file');
      }

      const newFile = await registerRes.json();
      log('File registered successfully in database');

      setStatus('success');
      onUploadSuccess(newFile);
      setSelectedFile(null); // Reset after success
    } catch (err: any) {
      log(`Error occurred: ${err.message}`);
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">File Uploader</h3>
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={status === 'uploading'}
      />

      {status === 'uploading' && (
        <Progress value={progress} className="w-full" />
      )}

      {selectedFile && (
        <Button onClick={handleUpload} disabled={status === 'uploading'}>
          {status === 'uploading'
            ? `Uploading... ${progress.toFixed(0)}%`
            : 'Upload File'}
        </Button>
      )}

      {status === 'success' && (
        <p className="text-green-600">Upload successful!</p>
      )}
      {status === 'error' && (
        <div className="space-y-2">
          <p className="text-red-600">Error: {error}</p>
          {debug && debugInfo && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600">
                Debug Information
              </summary>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
