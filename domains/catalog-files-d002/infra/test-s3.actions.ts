'use server';

// Test S3 configuration and connectivity
export async function testS3Configuration(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const requiredEnvVars = [
      'S3_ENDPOINT',
      'S3_REGION',
      'S3_BUCKET_NAME',
      'S3_ACCESS_KEY_ID',
      'S3_SECRET_ACCESS_KEY'
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    if (missingVars.length > 0) {
      return {
        success: false,
        error: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }

    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3');

    const s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
      }
    });

    const headBucketCommand = new HeadBucketCommand({
      Bucket: process.env.S3_BUCKET_NAME
    });
    await s3Client.send(headBucketCommand);

    const { getPresignedUploadUrl } = await import('./s3.service.server');
    const testUrl = await getPresignedUploadUrl('text/plain', 1024, 'test');

    return {
      success: true,
      data: {
        message: 'S3 configuration is working correctly',
        details: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION,
          bucket: process.env.S3_BUCKET_NAME,
          presignedUrlGenerated: !!testUrl.url,
          timestamp: new Date().toISOString()
        }
      }
    };
  } catch (error) {
    console.error('S3 configuration test failed:', error);

    let errorMessage = 'S3 configuration test failed';
    let details = '';

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes('NoSuchBucket')) {
        details =
          'The specified bucket does not exist. Please check your S3_BUCKET_NAME.';
      } else if (error.message.includes('AccessDenied')) {
        details =
          'Access denied. Please check your S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY.';
      } else if (error.message.includes('InvalidAccessKeyId')) {
        details = 'Invalid access key. Please check your S3_ACCESS_KEY_ID.';
      } else if (error.message.includes('SignatureDoesNotMatch')) {
        details = 'Invalid secret key. Please check your S3_SECRET_ACCESS_KEY.';
      } else if (
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED')
      ) {
        details =
          'Cannot connect to S3 endpoint. Please check your S3_ENDPOINT and network connectivity.';
      }
    }

    return {
      success: false,
      error: errorMessage,
      data: { details }
    };
  }
}
