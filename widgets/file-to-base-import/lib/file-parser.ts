import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { ParsedRecord } from '../types';

export class FileParser {
  static async parseExcel(file: File): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Берем первый лист
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Преобразуем в JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null
          }) as any[][];
          
          if (jsonData.length === 0) {
            resolve([]);
            return;
          }
          
          // Первая строка - заголовки
          const headers = jsonData[0] as string[];
          const records: ParsedRecord[] = [];
          
          // Обрабатываем данные начиная со второй строки
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const record: ParsedRecord = {};
            
            headers.forEach((header, index) => {
              if (header) {
                record[header] = row[index] || null;
              }
            });
            
            records.push(record);
          }
          
          resolve(records);
        } catch (error) {
          reject(new Error(`Ошибка парсинга Excel файла: ${error}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Ошибка чтения файла'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  static async parseCSV(file: File): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`Ошибка парсинга CSV: ${results.errors[0].message}`));
            return;
          }
          
          resolve(results.data as ParsedRecord[]);
        },
        error: (error) => {
          reject(new Error(`Ошибка парсинга CSV файла: ${error.message}`));
        }
      });
    });
  }
  
  static async parseFile(file: File): Promise<ParsedRecord[]> {
    const extension = file.name.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return this.parseExcel(file);
      case 'csv':
        return this.parseCSV(file);
      default:
        throw new Error(`Неподдерживаемый формат файла: ${extension}`);
    }
  }
} 
