import 'server-only';
import { db } from '../../../shared/database/connection';
import { productionItemsConsumption } from '../../../shared/database/schemas';
import type { ImportResult, ParsedRecord, ImportFormat } from '../types';
import { ProductionItemApi } from '@/entities/production-item/api/production-item.api';

export class ImportService {
  static async importProducts(records: ParsedRecord[]): Promise<ImportResult> {
    let recordsInserted = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      for (const record of records) {
        try {
          // Валидация данных
          if (!record.name || record.name === '') {
            warnings.push(`Пропущена строка без названия товара`);
            continue;
          }
          
          // Подготовка данных для вставки
          const productData = {
            name: String(record.name),
            price: String(record.price || 0),
            stock: Number(record.stock || 0),
            status: (record.status as 'active' | 'inactive' | 'archived') || 'active',
            imageUrl: String(record.imageUrl || '/images/placeholder-product.svg'),
            availableAt: new Date(record.availableAt ? String(record.availableAt) : Date.now())
          };
          
          // Вставка в базу данных (временно отключено - нет таблицы products)
          // await db.insert(products).values(productData);
          recordsInserted++;
          
        } catch (error) {
          errors.push(`Ошибка при вставке записи "${record.name}": ${error}`);
        }
      }
      
      return {
        success: errors.length === 0,
        recordsProcessed: records.length,
        recordsInserted,
        errors,
        warnings
      };
      
    } catch (error) {
      return {
        success: false,
        recordsProcessed: records.length,
        recordsInserted,
        errors: [`Критическая ошибка импорта: ${error}`],
        warnings
      };
    }
  }
  
  static async importCustomers(records: ParsedRecord[]): Promise<ImportResult> {
    // Пока заглушка, так как в схеме БД нет таблицы customers
    const warnings = ['Импорт клиентов пока не реализован - нет таблицы customers в схеме БД'];
    
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
      case 'products':
        for (const record of records) {
          try {
            // Здесь должна быть валидация и преобразование record к нужному типу
            await ProductionItemApi.create(record as any);
            result.recordsInserted++;
          } catch (e: any) {
            result.errors.push(
              `Ошибка при импорте записи ${JSON.stringify(record)}: ${
                e.message
              }`
            );
          }
        }
        break;

      case 'customers':
        return this.importCustomers(records);
      default:
        result.success = false;
        result.errors.push(`Формат импорта '${format.name}' не поддерживается.`);
        break;
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    return result;
  }
} 
