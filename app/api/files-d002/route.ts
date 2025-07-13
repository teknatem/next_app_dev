import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import {
  fileRepository,
  insertFileSchema
} from '@/domains/catalog-files-d002/index.server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = insertFileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const newFile = await fileRepository.createFile(validation.data);
    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error creating file:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(20)
    .parse(searchParams.get('limit'));
  const offset = z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0)
    .parse(searchParams.get('offset'));
  const includeDeletedParam = searchParams.get('includeDeleted');
  const includeDeleted = includeDeletedParam === 'true';

  try {
    const files = await fileRepository.getFiles({
      limit,
      offset,
      includeDeleted
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}
