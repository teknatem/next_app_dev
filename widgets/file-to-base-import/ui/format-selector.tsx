'use client';

import { Card, CardContent } from '@/shared/ui/card';
// RadioGroup не нужен, используем обычный input radio
import type { ImportFormat } from '../types';

interface FormatSelectorProps {
  formats: ImportFormat[];
  selectedFormat: ImportFormat | null;
  onFormatSelect: (format: ImportFormat | null) => void;
}

export function FormatSelector({
  formats,
  selectedFormat,
  onFormatSelect
}: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Выберите формат данных</label>

      <div className="space-y-2">
        {formats.map((format) => (
          <Card
            key={format.id}
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedFormat?.id === format.id
                ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => onFormatSelect(format)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={selectedFormat?.id === format.id}
                  onChange={() => onFormatSelect(format)}
                  className="mt-1 mr-2"
                />
                <div className="flex-1" style={{ marginLeft: '10px' }}>
                  <h3 className="font-medium">{format.name}</h3>
                  <p className="text-sm text-gray-600">{format.description}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Ожидаемые колонки:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {format.columns.map((column) => (
                        <span
                          key={column}
                          className="inline-block px-2 py-1 text-xs bg-gray-200 rounded"
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
