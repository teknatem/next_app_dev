'use client';

import { FileText, X } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUploader({
  onFileChange,
  selectedFile
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Выберите файл</label>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {selectedFile ? (
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <Button onClick={handleButtonClick} variant="outline">
                Выберите файл
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Поддерживаются файлы .xlsx, .xls, .csv
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
