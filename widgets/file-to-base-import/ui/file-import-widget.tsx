'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import type { ImportFormat, ImportResult } from '../types';
import { SUPPORTED_FORMATS } from '../types';
import { FileUploader } from './file-uploader';
import { FormatSelector } from './format-selector';
import { ImportResults } from './import-results';


export function FileImportWidget() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ImportFormat | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setImportResult(null); // Сбросить результат при выборе нового файла
  };

  const handleFormatSelect = (format: ImportFormat | null) => {
    setSelectedFormat(format);
    setImportResult(null); // Сбросить результат при смене формата
  };

  const handleImport = async () => {
    if (!selectedFile || !selectedFormat) {
      return;
    }

    setIsLoading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('formatId', selectedFormat.id);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        setImportResult({
          success: false,
          recordsProcessed: 0,
          recordsInserted: 0,
          errors: [result.error || 'Ошибка при импорте'],
          warnings: []
        });
      } else {
        setImportResult(result);
      }
    } catch (error) {
      setImportResult({
        success: false,
        recordsProcessed: 0,
        recordsInserted: 0,
        errors: ['Ошибка соединения с сервером'],
        warnings: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canImport = selectedFile && selectedFormat && !isLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Импорт данных из файла
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploader
            onFileChange={handleFileSelect}
            selectedFile={selectedFile}
          />

          <FormatSelector
            formats={SUPPORTED_FORMATS}
            selectedFormat={selectedFormat}
            onFormatSelect={handleFormatSelect}
          />

          <Button
            onClick={handleImport}
            disabled={!canImport}
            className="w-full"
          >
            {isLoading ? 'Импортируется...' : 'Загрузить данные'}
          </Button>
        </CardContent>
      </Card>

      {importResult && <ImportResults result={importResult} />}
    </div>
  );
}
