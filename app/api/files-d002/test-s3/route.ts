import { NextRequest, NextResponse } from 'next/server';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const {
      S3_ENDPOINT,
      S3_REGION,
      S3_BUCKET_NAME,
      S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY
    } = process.env;

    const envStatus = {
      S3_ENDPOINT: !!S3_ENDPOINT,
      S3_REGION: !!S3_REGION,
      S3_BUCKET_NAME: !!S3_BUCKET_NAME,
      S3_ACCESS_KEY_ID: !!S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY: !!S3_SECRET_ACCESS_KEY
    };

    const missingVars = Object.entries(envStatus)
      .filter(([_, exists]) => !exists)
      .map(([name]) => name);

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing S3 environment variables',
          missingVariables: missingVars,
          envStatus
        },
        { status: 500 }
      );
    }

    // Test S3 connection
    const s3Client = new S3Client({
      endpoint: S3_ENDPOINT!,
      region: S3_REGION!,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID!,
        secretAccessKey: S3_SECRET_ACCESS_KEY!
      }
    });

    // Try to access the bucket
    const command = new HeadBucketCommand({
      Bucket: S3_BUCKET_NAME!
    });

    await s3Client.send(command);

    return NextResponse.json({
      status: 'success',
      message: 'S3 configuration is valid and bucket is accessible',
      config: {
        endpoint: S3_ENDPOINT,
        region: S3_REGION,
        bucket: S3_BUCKET_NAME
      }
    });
  } catch (error) {
    console.error('S3 test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'S3 configuration test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
