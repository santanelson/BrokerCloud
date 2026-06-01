require('dotenv').config({ path: './api/.env' });
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

async function test() {
  const accountId = process.env.R2_ACCOUNT_ID?.replace(/"/g, '').trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.replace(/"/g, '').trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.replace(/"/g, '').trim();

  console.log('Testing R2 Connection with:');
  console.log('Account ID:', accountId);
  console.log('Access Key:', accessKeyId ? '***' + accessKeyId.slice(-4) : 'undefined');

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    forcePathStyle: true,
  });

  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('✅ Connection SUCCESS! Buckets:', data.Buckets.map(b => b.Name));
  } catch (err) {
    console.error('❌ Connection FAILED:', err.message);
    if (err.name === 'TimeoutError') {
      console.error('It might be blocked by a firewall.');
    }
  }
}

test();
