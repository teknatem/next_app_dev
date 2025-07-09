import { NextRequest, NextResponse } from 'next/server';
import { FileParser, DataMapper } from '@/widgets/file-to-base-import/lib';
import { ImportService } from '@/widgets/file-to-base-import/api/import';
import { SUPPORTED_FORMATS, type ImportFormat } from '@/widgets/file-to-base-import/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const formatId = formData.get('formatId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не предоставлен' },
        { status: 400 }
      );
    }
    
    if (!formatId) {
      return NextResponse.json(
        { error: 'Формат импорта не указан' },
        { status: 400 }
      );
    }
    
    // Находим формат импорта
    const format = SUPPORTED_FORMATS.find((f: ImportFormat) => f.id === formatId);
    if (!format) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат импорта' },
        { status: 400 }
      );
    }
    
    // Проверяем расширение файла
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Поддерживаются только файлы .xlsx, .xls и .csv' },
        { status: 400 }
      );
    }
    
    // Парсим файл
    const parsedRecords = await FileParser.parseFile(file);
    
    if (parsedRecords.length === 0) {
      return NextResponse.json(
        { error: 'Файл пуст или не содержит данных' },
        { status: 400 }
      );
    }
    
    // Маппим данные к выбранному формату
    const mappedRecords = DataMapper.mapToFormat(parsedRecords, format);
    
    // Импортируем в базу данных
    const result = await ImportService.importDataFromFile(
      mappedRecords,
      format
    );
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
} 
