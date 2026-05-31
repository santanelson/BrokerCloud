fetch('https://9b6c4d5742c90696911d38b2e96cd9db.r2.cloudflarestorage.com')
  .then(res => console.log('STATUS:', res.status))
  .catch(err => console.error('ERROR:', err));
