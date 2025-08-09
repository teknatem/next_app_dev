import 'server-only';
import { randomUUID } from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const {
  S3_ENDPOINT,
  S3_REGION,
  S3_BUCKET_NAME,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY
} = process.env;

if (
  !S3_ENDPOINT ||
  !S3_REGION ||
  !S3_BUCKET_NAME ||
  !S3_ACCESS_KEY_ID ||
  !S3_SECRET_ACCESS_KEY
) {
  throw new Error('S3 environment variables are not fully configured.');
}

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
  }
});

export async function getPresignedUploadUrl(
  mimeType: string,
  fileSize: number,
  folder: string = 'other'
): Promise<{ url: string; key: string }> {
  if (!mimeType || fileSize <= 0) {
    throw new Error('Invalid file type or size.');
  }

  const key = `${folder}/${randomUUID()}`;
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    ContentLength: fileSize
  });
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, key };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Could not generate a pre-signed URL for upload.');
  }
}

export async function getPresignedReadUrl(s3Key: string): Promise<string> {
  if (!s3Key) {
    throw new Error('S3 key is required.');
  }
  const command = new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: s3Key });
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error('Error generating pre-signed read URL:', error);
    throw new Error('Could not generate a pre-signed URL for reading.');
  }
}
