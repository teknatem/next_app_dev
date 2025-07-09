import type { ParsedRecord, ImportFormat } from '../types';

export class DataMapper {
  static mapToFormat(records: ParsedRecord[], format: ImportFormat): ParsedRecord[] {
    return records.map(record => {
      const mappedRecord: ParsedRecord = {};
      
      format.columns.forEach(column => {
        // Пытаемся найти соответствующее поле в исходных данных
        const value = this.findValueByColumn(record, column);
        mappedRecord[column] = this.normalizeValue(value, column);
      });
      
      return mappedRecord;
    });
  }
  
  private static findValueByColumn(record: ParsedRecord, targetColumn: string): any {
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
    const fuzzyMatch = keys.find(key => 
      key.toLowerCase() === targetColumn.toLowerCase()
    );
    
    if (fuzzyMatch) {
      return record[fuzzyMatch];
    }
    
    return null;
  }
  
  private static getColumnAliases(column: string): string[] {
    const aliasMap: Record<string, string[]> = {
      'name': ['название', 'наименование', 'имя', 'Name', 'Название'],
      'price': ['цена', 'стоимость', 'Price', 'Цена'],
      'stock': ['количество', 'остаток', 'Stock', 'Количество'],
      'status': ['статус', 'состояние', 'Status', 'Статус'],
      'email': ['почта', 'e-mail', 'Email', 'электронная почта'],
      'phone': ['телефон', 'тел', 'Phone', 'Телефон'],
      'imageUrl': ['изображение', 'картинка', 'фото', 'Image', 'Изображение'],
      'availableAt': ['дата', 'доступно с', 'Available At', 'Дата']
    };
    
    return aliasMap[column] || [];
  }
  
  private static normalizeValue(value: any, column: string): any {
    if (value === null || value === undefined || value === '') {
      return this.getDefaultValue(column);
    }
    
    switch (column) {
      case 'price':
        const price = parseFloat(String(value).replace(/[^\d.,]/g, '').replace(',', '.'));
        return isNaN(price) ? 0 : price;
        
      case 'stock':
        const stock = parseInt(String(value));
        return isNaN(stock) ? 0 : stock;
        
      case 'status':
        const statusValue = String(value).toLowerCase();
        if (statusValue.includes('активн') || statusValue === 'active') return 'active';
        if (statusValue.includes('неактивн') || statusValue === 'inactive') return 'inactive';
        if (statusValue.includes('архив') || statusValue === 'archived') return 'archived';
        return 'active';
        
      case 'availableAt':
        if (value instanceof Date) return value;
        const date = new Date(value);
        return isNaN(date.getTime()) ? new Date() : date;
        
      default:
        return String(value).trim();
    }
  }
  
  private static getDefaultValue(column: string): any {
    const defaults: Record<string, any> = {
      'name': '',
      'price': 0,
      'stock': 0,
      'status': 'active',
      'email': '',
      'phone': '',
      'imageUrl': '/images/placeholder-product.svg',
      'availableAt': new Date()
    };
    
    return defaults[column] || null;
  }
} 
