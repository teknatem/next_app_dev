import { NextRequest, NextResponse } from 'next/server';
import { fileRepository } from '@/domains/catalog-files-d002/data/file.repo';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const file = await fileRepository.getFileById(id);
    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
    console.error(`Error fetching file:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const updatedFile = await fileRepository.updateFile(id, validation.data);
    if (!updatedFile) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error(`Error updating file:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deletedFile = await fileRepository.softDeleteFile(id);
    if (!deletedFile) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'File marked as deleted' });
  } catch (error) {
    console.error(`Error deleting file:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}
