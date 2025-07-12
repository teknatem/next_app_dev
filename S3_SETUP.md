# S3 Configuration for File Uploads

## Problem: "Network error during upload"

If you're encountering the error "Network error during upload" when trying to upload files, it's likely due to missing or incorrect S3 configuration.

## Current Issue: CORS Error with Yandex Cloud

**Error:** `Access to XMLHttpRequest at 'https://next-api-dev.storage.yandexcloud.net/...' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Solution:** Configure CORS on your Yandex Cloud Storage bucket.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# S3 Configuration for File Upload
S3_ENDPOINT=https://storage.yandexcloud.net
S3_REGION=ru-central1
S3_BUCKET_NAME=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
```

## Setup Options

### Option 1: Yandex Cloud Storage (Current Setup)

1. **Configure CORS in Yandex Cloud Console:**
   - Go to [Yandex Cloud Console](https://console.cloud.yandex.ru/)
   - Navigate to Object Storage → Your bucket
   - Go to "CORS" tab
   - Add the following CORS rule:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://your-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

2. **Alternative: Using Yandex CLI:**

```bash
# Install Yandex CLI
curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# Configure CORS
yc storage bucket update --name your-bucket-name --cors-rule file://cors.json
```

**cors.json:**

```json
{
  "cors_rule": [
    {
      "allowed_headers": ["*"],
      "allowed_methods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "allowed_origins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-domain.com"
      ],
      "expose_headers": ["ETag"],
      "max_age_seconds": 3600
    }
  ]
}
```

### Option 2: AWS S3 (Alternative)

1. **Create an AWS Account** and set up an S3 bucket
2. **Configure IAM User** with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:PutObjectAcl",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
3. **Set environment variables**:
   - `S3_ENDPOINT=https://s3.amazonaws.com`
   - `S3_REGION=your-aws-region`
   - `S3_BUCKET_NAME=your-bucket-name`
   - `S3_ACCESS_KEY_ID=your-access-key`
   - `S3_SECRET_ACCESS_KEY=your-secret-key`

### Option 3: MinIO (Local Development)

For local development, you can use MinIO as an S3-compatible storage:

1. **Install MinIO**:

   ```bash
   # Using Docker
   docker run -p 9000:9000 -p 9001:9001 \
     -e MINIO_ROOT_USER=minioadmin \
     -e MINIO_ROOT_PASSWORD=minioadmin \
     minio/minio server /data --console-address ":9001"
   ```

2. **Create a bucket** via MinIO console (http://localhost:9001)

3. **Set environment variables**:
   ```env
   S3_ENDPOINT=http://localhost:9000
   S3_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   S3_ACCESS_KEY_ID=minioadmin
   S3_SECRET_ACCESS_KEY=minioadmin
   ```

## Quick Fix for Yandex Cloud CORS

**Method 1: Yandex Cloud Console (Recommended)**

1. Open [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Go to Object Storage → Your bucket → CORS
3. Add rule with origins: `http://localhost:3000`, `http://localhost:3001`

**Method 2: Programmatic CORS Setup**

```bash
# Using AWS CLI with Yandex Cloud endpoint
aws s3api put-bucket-cors \
  --bucket your-bucket-name \
  --cors-configuration file://cors.json \
  --endpoint-url=https://storage.yandexcloud.net
```

## Testing the Configuration

1. **Visit** the file upload page: http://localhost:3000/files
2. **Click** "Test S3 Configuration" button
3. **Check** the results:
   - ✅ Success: Your S3 is configured correctly
   - ❌ Error: Check the error details and fix the configuration

## Common Issues

### 1. CORS Errors (Current Issue)

- **Error**: "Access to XMLHttpRequest... has been blocked by CORS policy"
- **Solution**: Configure CORS on your Yandex Cloud bucket to allow your domain

### 2. Missing Environment Variables

- **Error**: "Missing S3 environment variables"
- **Solution**: Ensure all required variables are set in `.env.local`

### 3. Access Denied

- **Error**: "Access Denied" or "403 Forbidden"
- **Solution**: Check IAM permissions and bucket policies

### 4. Network Errors

- **Error**: "Network error during upload"
- **Solution**:
  - Check if S3 endpoint is reachable
  - Verify CORS configuration
  - Ensure firewall/network allows connections

## Debugging

Enable debug mode in the file uploader to get detailed error information:

- The file uploader has debug mode enabled by default
- Check browser console for detailed logs
- Use the "Debug Information" section when errors occur

## Security Notes

- Never commit `.env.local` to version control
- Use IAM roles with minimal required permissions
- Consider using presigned URLs for enhanced security
- Rotate access keys regularly

## Yandex Cloud Specific Notes

- Endpoint: `https://storage.yandexcloud.net`
- Region: `ru-central1` (for Russia Central)
- CORS configuration is essential for browser uploads
- Use Yandex Cloud Console or CLI for bucket management
