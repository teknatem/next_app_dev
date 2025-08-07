import type { ParsedRecord, ImportFormat } from '../types';

export class DataMapper {
  static mapToFormat(
    records: ParsedRecord[],
    format: ImportFormat
  ): ParsedRecord[] {
    return records.map((record) => {
      const mappedRecord: ParsedRecord = {};

      format.columns.forEach((column) => {
        // Пытаемся найти соответствующее поле в исходных данных
        const value = this.findValueByColumn(record, column);
        mappedRecord[column] = this.normalizeValue(value, column);
      });

      return mappedRecord;
    });
  }

  private static findValueByColumn(
    record: ParsedRecord,
    targetColumn: string
  ): any {
    // Точное совпадение
    if (record[targetColumn] !== undefined) {
      return record[targetColumn];
    }

    // Поиск по алиасам
    const aliases = this.getColumnAliases(targetColumn);
    for (const alias of aliases) {
      if (record[alias] !== undefined) {
        return record[alias];
      }
    }

    // Поиск без учета регистра
    const keys = Object.keys(record);
    const fuzzyMatch = keys.find(
      (key) => key.toLowerCase() === targetColumn.toLowerCase()
    );

    if (fuzzyMatch) {
      return record[fuzzyMatch];
    }

    return null;
  }

  private static getColumnAliases(column: string): string[] {
    const aliasMap: Record<string, string[]> = {
      name: ['название', 'наименование', 'имя', 'Name', 'Название'],
      email: ['почта', 'e-mail', 'Email', 'электронная почта'],
      phone: ['телефон', 'тел', 'Phone', 'Телефон']
    };

    return aliasMap[column] || [];
  }

  private static normalizeValue(value: any, column: string): any {
    if (value === null || value === undefined || value === '') {
      return this.getDefaultValue(column);
    }

    // For customers, just trim string values
    return String(value).trim();
  }

  private static getDefaultValue(column: string): any {
    const defaults: Record<string, any> = {
      name: '',
      email: '',
      phone: ''
    };

    return defaults[column] || null;
  }
}
