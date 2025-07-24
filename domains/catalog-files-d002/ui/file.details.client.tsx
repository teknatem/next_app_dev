'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { useState } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/shared/ui/card';
import { ClientFormattedDate } from '@/shared/ui/client-formatted-date';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/ui/dialog';

import { toISOString } from '../lib/date-utils';
import { File } from '../types.shared';
import { updateFile } from '../features/crud.server';

interface FileDetailsProps {
  file: File;
  onClose: () => void;
  onFileUpdated?: (updatedFile: File) => void;
}

export function FileDetails({
  file,
  onClose,
  onFileUpdated
}: FileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: file.title,
    description: file.description || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isImage = file.mimeType.startsWith('image/');

  const handleSave = async () => {
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', editData.title);
        formData.append('description', editData.description || '');

        const result = await updateFile(file.id, formData);

        if (result.success && result.data) {
          const updatedFile = result.data as File;

          // Update the file data with the response
          if (onFileUpdated) {
            onFileUpdated(updatedFile);
          }

          setIsEditing(false);
        } else {
          setError(result.error || 'Failed to update file');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save changes');
      }
    });
  };

  const handleCancel = () => {
    setEditData({
      title: file.title,
      description: file.description || ''
    });
    setError(null);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditData({
      title: file.title,
      description: file.description || ''
    });
    setIsEditing(true);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                    className="mt-1"
                    placeholder="Enter file description..."
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            ) : (
              <div>
                <CardTitle>{file.title}</CardTitle>
                <CardDescription>File ID: {file.id}</CardDescription>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isPending || !editData.title.trim()}
                >
                  {isPending ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleStartEdit}>
                Edit
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              X
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isImage && (
          <div className="flex justify-center">
            <Image
              src={file.url}
              alt={file.title}
              width={800}
              height={600}
              className="max-w-full max-h-96 rounded-lg object-contain"
            />
          </div>
        )}
        {!isEditing && (
          <div>
            <strong>Description:</strong>
            <p className="text-muted-foreground">
              {file.description || 'No description provided.'}
            </p>
          </div>
        )}
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
