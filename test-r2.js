const https = require('https');

const req = https.request({
  hostname: '9b6c4d5742c90696911d38b2e96cd9db.r2.cloudflarestorage.com',
  port: 443,
  method: 'GET',
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3'
}, (res) => {
  console.log('STATUS:', res.statusCode);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => {
  console.error('ERROR:', e.message, e.code, e.syscall);
});

req.end();
