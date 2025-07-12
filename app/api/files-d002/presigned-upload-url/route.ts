import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/domains/catalog-files-d002/lib/s3.service';
import { z } from 'zod';

const uploadSchema = z.object({
  mimeType: z.string().min(1, 'MIME type is required'),
  fileSize: z.number().positive('File size must be positive'),
  folder: z.string().optional().default('other')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = uploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { mimeType, fileSize, folder } = validation.data;

    // Optional: Add server-side validation for file types or sizes here
    // For example, restrict to certain MIME types
    if (
      !mimeType.startsWith('image/') &&
      !mimeType.startsWith('audio/') &&
      !mimeType.startsWith('application/pdf')
    ) {
      return NextResponse.json(
        { message: 'Unsupported file type.' },
        { status: 400 }
      );
    }

    const data = await getPresignedUploadUrl(mimeType, fileSize, folder);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in presigned-upload-url route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Internal Server Error', error: errorMessage },
      { status: 500 }
    );
  }
}
