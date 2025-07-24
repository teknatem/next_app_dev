'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { FilePicker } from '@/domains/catalog-files-d002/ui/file.picker.client';
import { FileUploader } from '@/domains/catalog-files-d002/ui/file.uploader.client';
import { type File as D002File } from '@/domains/catalog-files-d002';
import { Plus } from 'lucide-react';

interface MeetingAssetManagerProps {
  meetingId: string;
  createAssetAction: (data: {
    meetingId: string;
    fileId: string;
  }) => Promise<any>;
}

export function MeetingAssetManager({
  meetingId,
  createAssetAction
}: MeetingAssetManagerProps) {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isUploaderOpen, setUploaderOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: D002File) => {
    setError(null); // Clear previous errors
    startTransition(async () => {
      const result = await createAssetAction({
        meetingId,
        fileId: selectedFile.id
      });
      if (result && result.success) {
        setPickerOpen(false);
      } else {
        setError(result?.error || 'Failed to add file.');
      }
    });
  };

  const handleUploadComplete = (newFile: unknown) => {
    // Transform the API response to match the expected schema
    let transformedFile = newFile;

    if (newFile && typeof newFile === 'object') {
      const fileObj = newFile as Record<string, any>;
      transformedFile = {
        ...fileObj,
        ...(fileObj.createdAt &&
          typeof fileObj.createdAt === 'string' && {
            createdAt: new Date(fileObj.createdAt)
          }),
        ...(fileObj.updatedAt &&
          typeof fileObj.updatedAt === 'string' && {
            updatedAt: new Date(fileObj.updatedAt)
          })
      };
    }

    // Простая проверка обязательных полей (клиенту не нужна полная Zod валидация)
    const fileData = transformedFile as any;
    if (!fileData.id || !fileData.title) {
      console.error('Uploaded file missing required fields:', transformedFile);
      return;
    }
    const validatedFile = fileData as D002File;

    setError(null); // Clear previous errors
    startTransition(async () => {
      const result = await createAssetAction({
        meetingId,
        fileId: validatedFile.id
      });
      if (result && result.success) {
        setUploaderOpen(false);
      } else {
        setError(result?.error || 'Failed to add file after upload.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Dialog open={isPickerOpen} onOpenChange={setPickerOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Добавить из хранилища</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Выберите файл из хранилища</DialogTitle>
            </DialogHeader>
            <FilePicker onFileSelect={handleFileSelect} />
          </DialogContent>
        </Dialog>

        <Dialog open={isUploaderOpen} onOpenChange={setUploaderOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Загрузить новый файл
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Загрузка нового файла</DialogTitle>
            </DialogHeader>
            <FileUploader onUploadSuccess={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
