# 🔧 CORS Fix Guide for Yandex Cloud

## ❌ Current Problem

You're getting this error when trying to upload files:

```
Access to XMLHttpRequest at 'https://next-api-dev.storage.yandexcloud.net/...'
from origin 'http://localhost:3001' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solution: Configure CORS on Yandex Cloud

### Step 1: Open Yandex Cloud Console

1. Go to [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Log in with your account
3. Select the correct project/folder

### Step 2: Navigate to Your Storage Bucket

1. In the left sidebar, click **"Object Storage"**
2. Find your bucket (looks like `next-api-dev` based on the error)
3. Click on the bucket name to open it

### Step 3: Configure CORS

1. In the bucket page, click the **"CORS"** tab
2. Click **"Add rule"** or **"Configure CORS"**
3. Add the following configuration:

```json
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
```

### Step 4: Save and Test

1. Click **"Save"** or **"Apply"**
2. Wait a few minutes for the changes to propagate
3. Test the upload again

## 🧪 Testing CORS Configuration

Use the built-in test script:

```bash
npm run test:cors
```

This will check if CORS is properly configured and give you detailed feedback.

## 📋 Alternative Method: Using AWS CLI

If you have AWS CLI installed and configured for Yandex Cloud:

```bash
# Configure CORS using AWS CLI
aws s3api put-bucket-cors \
  --bucket your-bucket-name \
  --cors-configuration file://scripts/yandex-cors-config.json \
  --endpoint-url=https://storage.yandexcloud.net
```

## 🔍 Troubleshooting

### Issue 1: Changes Not Taking Effect

- Wait 5-10 minutes after saving CORS configuration
- Clear your browser cache
- Try a hard refresh (Ctrl+F5)

### Issue 2: Still Getting CORS Errors

- Double-check the bucket name in your `.env.local`
- Ensure you're using the correct endpoint
- Verify all origins are listed in CORS configuration

### Issue 3: Can't Find CORS Tab

- Make sure you're in the correct bucket
- Check your permissions - you need admin access to the bucket
- Try refreshing the console page

## 🎯 Quick Checklist

- [ ] Opened Yandex Cloud Console
- [ ] Found the correct bucket (`next-api-dev`)
- [ ] Added CORS rule with `http://localhost:3000` and `http://localhost:3001`
- [ ] Saved the configuration
- [ ] Waited 5 minutes
- [ ] Tested file upload again
- [ ] Ran `npm run test:cors` to verify

## ⚡ Emergency Workaround

If you can't access Yandex Cloud console right now, you can temporarily switch to MinIO for local development:

1. **Start MinIO:**

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

2. **Update `.env.local`:**

```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET_NAME=test-bucket
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
```

3. **Create bucket in MinIO console:** http://localhost:9001

## 📞 Need Help?

If you're still having issues:

1. Run `npm run test:cors` and share the output
2. Check your browser's Network tab for more details
3. Verify your `.env.local` file has the correct values
4. Make sure your Yandex Cloud permissions allow CORS configuration

## 🔐 Security Note

Remember to update the `AllowedOrigins` in production to only include your actual domain, not `localhost`.
