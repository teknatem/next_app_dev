'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';

import { FileList } from '../file-list';
import { getFiles } from '../../infra/crud.actions';
import { File } from '../../types.shared';

interface FilePickerProps {
  onFileSelect: (_file: File) => void;
  triggerButtonText?: string;
}

export function FilePicker({
  onFileSelect,
  triggerButtonText = 'Select a File'
}: FilePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (_file: File) => {
    onFileSelect(_file);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerButtonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select a File</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <FileList onFileSelect={handleFileSelect} getFilesAction={getFiles} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
