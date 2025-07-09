export interface ImportFormat {
  id: string;
  name: string;
  description: string;
  columns: string[];
}

export interface ImportOptions {
  format: ImportFormat;
  file: File;
}

export interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsInserted: number;
  errors: string[];
  warnings: string[];
}

export interface ParsedRecord {
  [key: string]: string | number | null;
}

export const SUPPORTED_FORMATS: ImportFormat[] = [
  {
    id: 'products',
    name: 'Товары',
    description: 'Импорт товаров (название, цена, количество, статус)',
    columns: ['name', 'price', 'stock', 'status', 'imageUrl', 'availableAt']
  },
  {
    id: 'customers',
    name: 'Клиенты',
    description: 'Импорт клиентов (имя, email, телефон)',
    columns: ['name', 'email', 'phone']
  }
]; 
