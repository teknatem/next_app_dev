import { randomUUID } from 'crypto';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

/**
 * Generates a pre-signed URL for uploading a file to the S3 bucket.
 *
 * @param {string} mimeType - The MIME type of the file to be uploaded.
 * @param {number} fileSize - The size of the file in bytes.
 * @param {string} [folder='other'] - The folder within the bucket to upload the file to.
 * @returns {Promise<{ url: string; key: string }>} - The pre-signed URL and the unique S3 key for the file.
 */
export async function getPresignedUploadUrl(
  mimeType: string,
  fileSize: number,
  folder: string = 'other'
): Promise<{ url: string; key: string }> {
  // Basic validation
  if (!mimeType || fileSize <= 0) {
    throw new Error('Invalid file type or size.');
  }

  // Optional: Add more specific size validation if needed
  // e.g., if (fileSize > 10 * 1024 * 1024) throw new Error('File too large');

  const key = `${folder}/${randomUUID()}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    ContentLength: fileSize
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return { url, key };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Could not generate a pre-signed URL for upload.');
  }
}
