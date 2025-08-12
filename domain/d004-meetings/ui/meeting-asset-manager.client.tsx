'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/shared/ui/button';
import { FilePickerDialog } from '@/domain/d002-files/ui/file-picker-dialog';
import { type File as D002File } from '@/domain/d002-files';
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

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <FilePickerDialog
          trigger={<Button variant="outline">Добавить из хранилища</Button>}
          onSelectFile={handleFileSelect}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
