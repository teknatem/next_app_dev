'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import type { ImportResult } from '../types';

interface ImportResultsProps {
  result: ImportResult;
}

export function ImportResults({ result }: ImportResultsProps) {
  const getStatusIcon = () => {
    if (result.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (result.success) {
      return (
        <Badge variant="default" className="bg-green-500">
          Успешно
        </Badge>
      );
    }
    return <Badge variant="destructive">Ошибка</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Результаты импорта
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Обработано записей</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {result.recordsProcessed}
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Импортировано</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {result.recordsInserted}
            </p>
          </div>
        </div>

        {/* Предупреждения */}
        {result.warnings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Предупреждения</span>
              <Badge
                variant="outline"
                className="text-yellow-600 border-yellow-300"
              >
                {result.warnings.length}
              </Badge>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <ul className="space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Ошибки */}
        {result.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Ошибки</span>
              <Badge variant="destructive">{result.errors.length}</Badge>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Сообщение об успехе */}
        {result.success && result.recordsInserted > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✅ Импорт завершен успешно! Добавлено {result.recordsInserted}{' '}
              записей из {result.recordsProcessed} обработанных.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
