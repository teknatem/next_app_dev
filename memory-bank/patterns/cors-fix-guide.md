### CORS Fix Guide (Yandex Cloud)

Symptoms when uploading files:

```
Access to XMLHttpRequest at 'https://<bucket>.storage.yandexcloud.net/...'
from origin 'http://localhost:3001' has been blocked by CORS policy
```

### Configure CORS (UI)

In Yandex Cloud → Object Storage → your bucket → CORS tab → add a rule like:

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

Adjust `AllowedOrigins` for your environments. Save and wait 2–5 minutes.

### Test

```bash
pnpm test:cors
```

### Configure via CLI (optional)

Requires AWS CLI configured for Yandex:

```bash
aws s3api put-bucket-cors \
  --bucket <your-bucket> \
  --cors-configuration file://scripts/yandex-cors-config.json \
  --endpoint-url=https://storage.yandexcloud.net
```

### Troubleshooting

- Ensure correct bucket and endpoint are used in app and env.
- Verify all needed origins are included. Then hard-refresh/clear cache.
- Give changes time to propagate (up to 10 minutes).

### Security

In production, restrict `AllowedOrigins` to your real domains only (no `localhost`).
