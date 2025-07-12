#!/usr/bin/env node

/**
 * Simple CORS test script for Yandex Cloud Storage
 * Usage: node scripts/test-cors.js
 */

const https = require('https');
const { URL } = require('url');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!S3_ENDPOINT || !S3_BUCKET_NAME) {
  console.error('❌ Missing S3_ENDPOINT or S3_BUCKET_NAME in .env.local');
  process.exit(1);
}

console.log('🔍 Testing CORS configuration...');
console.log(`📍 Endpoint: ${S3_ENDPOINT}`);
console.log(`🗄️  Bucket: ${S3_BUCKET_NAME}`);

// Create a test URL
const testUrl = new URL(`${S3_ENDPOINT}/${S3_BUCKET_NAME}`);

// Make an OPTIONS request to test CORS
const options = {
  hostname: testUrl.hostname,
  port: testUrl.port || 443,
  path: testUrl.pathname,
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:3000',
    'Access-Control-Request-Method': 'PUT',
    'Access-Control-Request-Headers': 'content-type'
  }
};

const req = https.request(options, (res) => {
  console.log(`\n📡 Response Status: ${res.statusCode}`);
  console.log('📋 Response Headers:');
  
  Object.keys(res.headers).forEach(key => {
    if (key.toLowerCase().includes('access-control') || key.toLowerCase().includes('cors')) {
      console.log(`   ${key}: ${res.headers[key]}`);
    }
  });

  const corsHeaders = res.headers['access-control-allow-origin'];
  if (corsHeaders) {
    console.log('\n✅ CORS is configured!');
    console.log(`   Allowed Origins: ${corsHeaders}`);
  } else {
    console.log('\n❌ CORS is NOT configured properly');
    console.log('   Missing Access-Control-Allow-Origin header');
  }

  // Check for specific headers
  const allowMethods = res.headers['access-control-allow-methods'];
  const allowHeaders = res.headers['access-control-allow-headers'];
  
  if (allowMethods) {
    console.log(`   Allowed Methods: ${allowMethods}`);
  }
  if (allowHeaders) {
    console.log(`   Allowed Headers: ${allowHeaders}`);
  }

  console.log('\n📝 Next steps:');
  if (!corsHeaders) {
    console.log('1. Go to Yandex Cloud Console: https://console.cloud.yandex.ru/');
    console.log('2. Navigate to Object Storage → Your bucket');
    console.log('3. Go to "CORS" tab');
    console.log('4. Add the CORS rule from scripts/yandex-cors-config.json');
  } else {
    console.log('✅ CORS is configured. Try uploading a file now!');
  }
});

req.on('error', (error) => {
  console.error(`❌ Request failed: ${error.message}`);
  console.log('\n🔧 Possible issues:');
  console.log('1. Check your S3_ENDPOINT and S3_BUCKET_NAME in .env.local');
  console.log('2. Ensure your bucket exists');
  console.log('3. Check network connectivity');
});

req.end(); 