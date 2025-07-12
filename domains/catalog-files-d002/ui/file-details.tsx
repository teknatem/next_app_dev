'use client';

import { File } from '../model/files.schema';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/shared/ui/card';
import { ClientFormattedDate } from '@/shared/ui/client-formatted-date';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { toISOString } from '../lib/date-utils';

interface FileDetailsProps {
  file: File;
  onClose: () => void;
}

export function FileDetails({ file, onClose }: FileDetailsProps) {
  const isImage = file.mimeType.startsWith('image/');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{file.title}</CardTitle>
            <CardDescription>File ID: {file.id}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            X
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isImage && (
          <div className="flex justify-center">
            <img
              src={file.url}
              alt={file.title}
              className="max-w-full max-h-96 rounded-lg object-contain"
            />
          </div>
        )}
        <div>
          <strong>Description:</strong>
          <p className="text-muted-foreground">
            {file.description || 'No description provided.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>MIME Type:</strong>{' '}
            <Badge variant="outline">{file.mimeType}</Badge>
          </div>
          <div>
            <strong>Size:</strong> {(file.fileSize / 1024).toFixed(2)} KB
          </div>
          <div>
            <strong>Created At:</strong>{' '}
            <ClientFormattedDate dateString={toISOString(file.createdAt)} />
          </div>
          <div>
            <strong>Last Updated:</strong>{' '}
            <ClientFormattedDate dateString={toISOString(file.updatedAt)} />
          </div>
          <div>
            <strong>Status:</strong>{' '}
            {file.isDeleted ? (
              <Badge variant="destructive">Deleted</Badge>
            ) : (
              <Badge variant="secondary">Active</Badge>
            )}
          </div>
          <div>
            <strong>S3 Key:</strong>{' '}
            <code className="text-sm bg-muted p-1 rounded">{file.s3Key}</code>
          </div>
        </div>
        <div>
          <strong>Direct URL:</strong>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {file.url}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
