const fs = require('fs');
const path = require('path');

const dummyFile = path.join(__dirname, 'dummy.jpg');
fs.writeFileSync(dummyFile, Buffer.alloc(2 * 1024 * 1024, 'a')); // 2MB

async function testUpload() {
  try {
    const fileBlob = new Blob([fs.readFileSync(dummyFile)], { type: 'image/jpeg' });
    const form = new FormData();
    form.append('file', fileBlob, 'dummy.jpg');

    console.log('Sending request to http://localhost:3001/upload...');
    
    const res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: form,
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error during upload test:', err);
  } finally {
    fs.unlinkSync(dummyFile);
  }
}

testUpload();
