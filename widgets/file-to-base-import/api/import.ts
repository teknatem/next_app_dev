import 'server-only';

import { db } from '../../../shared/database/connection';
import type { ImportResult, ParsedRecord, ImportFormat } from '../types';

export class ImportService {
  static async importCustomers(records: ParsedRecord[]): Promise<ImportResult> {
    // Пока заглушка, так как в схеме БД нет таблицы customers
    const warnings = [
      'Импорт клиентов пока не реализован - нет таблицы customers в схеме БД'
    ];

    return {
      success: false,
      recordsProcessed: records.length,
      recordsInserted: 0,
      errors: [],
      warnings
    };
  }

  static async importDataFromFile(
    records: ParsedRecord[],
    format: ImportFormat
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      recordsProcessed: records.length,
      recordsInserted: 0,
      errors: [],
      warnings: []
    };

    switch (format.id) {
      case 'customers':
        return this.importCustomers(records);
      default:
        result.success = false;
        result.errors.push(
          `Формат импорта '${format.name}' не поддерживается.`
        );
        break;
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    return result;
  }
}
