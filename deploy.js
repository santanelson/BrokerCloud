const fs = require('fs');
const path = require('path');
const readline = require('readline');
const net = require('net');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Função para buscar porta livre
const getFreePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Helper: atualiza ou adiciona uma variável no conteúdo do .env
function setEnvVar(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envContent)) {
    return envContent.replace(regex, `${key}="${value}"`);
  }
  return envContent + `\n${key}="${value}"`;
}

async function run() {
  console.log('\n🚀 ═══════════════════════════════════════════════════════════');
  console.log('       BROKERCLOUD — ASSISTENTE DE DEPLOY COMPLETO');
  console.log('═══════════════════════════════════════════════════════════ 🚀\n');

  // ─── 1. Domínio ──────────────────────────────────────────────────────────────
  console.log('📌 ETAPA 1/5 — DOMÍNIO\n');
  let domain = await askQuestion('👉 Qual o seu domínio principal (ex: brokercloud.com.br)? ');
  domain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!domain) {
    console.log('Domínio inválido! Usando localhost como padrão.');
    domain = 'localhost';
  }

  const apiDomain = domain === 'localhost' ? 'localhost' : `api.${domain}`;

  // ─── 2. Infraestrutura (Docker / Manual) ──────────────────────────────────────
  console.log('\n📌 ETAPA 2/5 — INFRAESTRUTURA (Banco de Dados & Redis)\n');
  const useDocker = await askQuestion('👉 Deseja subir o PostgreSQL e Redis isolados usando Docker agora? (S/N) ');
  const isDocker = useDocker.trim().toLowerCase() === 's';

  let dbUrl = '';
  let redisUrl = '';

  console.log('\n🔍 Buscando portas disponíveis no servidor...');
  const apiPort = await getFreePort(3001);
  const webPort = await getFreePort(3000);

  console.log(`✅ API rodará na porta: ${apiPort}`);
  console.log(`✅ Web rodará na porta: ${webPort}`);

  if (isDocker) {
    const dbPort = await getFreePort(5432);
    const redisPort = await getFreePort(6379);
    console.log(`✅ Docker Postgres rodará na porta: ${dbPort}`);
    console.log(`✅ Docker Redis rodará na porta: ${redisPort}`);

    dbUrl = `postgresql://brokercloud:brokercloud_dev_pass@localhost:${dbPort}/brokercloud`;
    redisUrl = `redis://localhost:${redisPort}`;

    fs.writeFileSync(path.join(__dirname, '.env'), `DB_PORT=${dbPort}\nREDIS_PORT=${redisPort}\n`);

    console.log('\n🐳 Subindo contêineres do Docker em background...');
    try {
      execSync('docker compose up -d', { cwd: __dirname, stdio: 'inherit' });
      console.log('⏳ Aguardando 5 segundos para o banco iniciar...');
      execSync('sleep 5');
    } catch (err) {
      console.error('❌ Falha ao iniciar Docker. Tem certeza que o Docker/Docker Compose está instalado?');
    }
  } else {
    dbUrl = await askQuestion('👉 Qual a URL do PostgreSQL? (ex: postgresql://user:pass@host:5432/db) ');
    redisUrl = await askQuestion('👉 Qual a URL do Redis? (ex: redis://localhost:6379) ');
  }

  // ─── 3. Segurança (JWT) ───────────────────────────────────────────────────────
  console.log('\n📌 ETAPA 3/5 — SEGURANÇA (JWT)\n');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
  console.log('✅ Chaves JWT geradas automaticamente (64 caracteres cada).');

  // ─── 4. Cloudflare R2 (Upload de Imagens) ─────────────────────────────────────
  console.log('\n📌 ETAPA 4/5 — CLOUDFLARE R2 (Upload de Imagens)\n');
  const r2AccountId = await askQuestion('👉 R2 Account ID (visível na URL do painel Cloudflare): ');
  const r2AccessKey = await askQuestion('👉 R2 Access Key ID: ');
  const r2SecretKey = await askQuestion('👉 R2 Secret Access Key: ');
  const r2Bucket = await askQuestion('👉 Nome do Bucket (ex: broker): ');
  const r2PublicUrl = await askQuestion('👉 URL pública do Bucket (ex: https://pub-xxx.r2.dev): ');

  // ─── 5. Evolution API (WhatsApp) — Opcional ───────────────────────────────────
  console.log('\n📌 ETAPA 5/5 — WHATSAPP (Evolution API) — Opcional\n');
  const useEvolution = await askQuestion('👉 Deseja configurar a Evolution API (WhatsApp)? (S/N) ');
  let evolutionUrl = '';
  let evolutionKey = '';

  if (useEvolution.trim().toLowerCase() === 's') {
    evolutionUrl = await askQuestion('👉 URL da Evolution API (ex: https://whatsapp.seudominio.com.br): ');
    evolutionKey = await askQuestion('👉 Global API Key da Evolution: ');
  }

  // ─── Montar o .env da API ─────────────────────────────────────────────────────
  console.log('\n📝 Montando variáveis de ambiente (.env)...');

  const apiEnvPath = path.join(__dirname, 'api', '.env');
  const apiEnvExamplePath = path.join(__dirname, 'api', '.env.example');
  let apiEnv = '';

  if (fs.existsSync(apiEnvPath)) {
    apiEnv = fs.readFileSync(apiEnvPath, 'utf8');
  } else if (fs.existsSync(apiEnvExamplePath)) {
    apiEnv = fs.readFileSync(apiEnvExamplePath, 'utf8');
    console.log('➜ Criado api/.env a partir do .env.example');
  }

  const frontendUrl = domain === 'localhost' ? `http://localhost:${webPort}` : `https://${domain}`;

  // Servidor
  apiEnv = setEnvVar(apiEnv, 'NODE_ENV', 'production');
  apiEnv = setEnvVar(apiEnv, 'PORT', apiPort);
  apiEnv = setEnvVar(apiEnv, 'HOST', '0.0.0.0');
  apiEnv = setEnvVar(apiEnv, 'FRONTEND_URL', frontendUrl);

  // Banco e Redis
  if (dbUrl.trim()) apiEnv = setEnvVar(apiEnv, 'DATABASE_URL', dbUrl.trim());
  if (redisUrl.trim()) apiEnv = setEnvVar(apiEnv, 'REDIS_URL', redisUrl.trim());

  // JWT
  apiEnv = setEnvVar(apiEnv, 'JWT_SECRET', jwtSecret);
  apiEnv = setEnvVar(apiEnv, 'JWT_EXPIRES_IN', '15m');
  apiEnv = setEnvVar(apiEnv, 'JWT_REFRESH_SECRET', jwtRefreshSecret);
  apiEnv = setEnvVar(apiEnv, 'JWT_REFRESH_EXPIRES_IN', '7d');

  // Cloudflare R2
  if (r2AccountId.trim()) apiEnv = setEnvVar(apiEnv, 'R2_ACCOUNT_ID', r2AccountId.trim());
  if (r2AccessKey.trim()) apiEnv = setEnvVar(apiEnv, 'R2_ACCESS_KEY_ID', r2AccessKey.trim());
  if (r2SecretKey.trim()) apiEnv = setEnvVar(apiEnv, 'R2_SECRET_ACCESS_KEY', r2SecretKey.trim());
  if (r2Bucket.trim()) apiEnv = setEnvVar(apiEnv, 'R2_BUCKET_NAME', r2Bucket.trim());
  if (r2PublicUrl.trim()) apiEnv = setEnvVar(apiEnv, 'R2_PUBLIC_URL', r2PublicUrl.trim());

  // Evolution API
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_URL', evolutionUrl.trim() || 'https://sua-instancia-evolution.com');
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_KEY', evolutionKey.trim());

  fs.writeFileSync(apiEnvPath, apiEnv);

  // ─── Montar o .env.local do Web ──────────────────────────────────────────────
  const webEnvPath = path.join(__dirname, 'web', '.env.local');
  const apiUrl = domain === 'localhost' ? `http://localhost:${apiPort}` : `https://${apiDomain}`;
  fs.writeFileSync(webEnvPath, `NEXT_PUBLIC_API_URL=${apiUrl}\n`);

  console.log('✅ Arquivos .env atualizados!');

  // ─── Gerar Nginx ──────────────────────────────────────────────────────────────
  console.log('\n⚙️  Gerando configurações para a VPS...');

  if (domain !== 'localhost') {
    const nginxConf = `
# BrokerCloud — Nginx (gerado automaticamente)
server {
    listen 80;
    server_name ${apiDomain};
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${apiPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name ${domain} www.${domain};
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${webPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;
    fs.writeFileSync(path.join(__dirname, 'nginx.conf'), nginxConf.trim());
    console.log('✅ nginx.conf gerado com sucesso!');
  }

  // ─── Gerar PM2 ────────────────────────────────────────────────────────────────
  const pm2Config = `
module.exports = {
  apps: [
    {
      name: 'brokercloud-api',
      script: 'npm',
      args: 'run start --prefix api',
      cwd: '${__dirname}',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'brokercloud-web',
      script: 'npm',
      args: 'run start --prefix web',
      cwd: '${__dirname}',
      env: {
        NODE_ENV: 'production',
        PORT: ${webPort}
      }
    }
  ]
};
`;
  fs.writeFileSync(path.join(__dirname, 'ecosystem.config.js'), pm2Config.trim());
  console.log('✅ ecosystem.config.js (PM2) gerado com sucesso!');

  // ─── Build ────────────────────────────────────────────────────────────────────
  console.log('\n🔨 Construindo o projeto (Build)... Pode demorar alguns minutos...');

  try {
    console.log('➜ Preparando o Banco de Dados (Prisma)...');
    execSync('npx prisma generate', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });
    execSync('npx prisma migrate deploy', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Construindo API...');
    execSync('npm run build', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Construindo Web (Next.js)...');
    execSync('npm run build', { cwd: path.join(__dirname, 'web'), stdio: 'inherit' });

    console.log('\n🎉 ═══════════════════════════════════════════════════════════');
    console.log('          BUILD CONCLUÍDO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════ 🎉\n');
    console.log('Para colocar no ar agora na sua VPS:\n');
    console.log('1. Instale o PM2 se não tiver:');
    console.log('   npm install -g pm2\n');
    console.log('2. Inicie os servidores:');
    console.log('   pm2 start ecosystem.config.js\n');
    console.log('3. Copie o Nginx e gere o SSL:');
    console.log('   sudo cp nginx.conf /etc/nginx/sites-available/brokercloud');
    console.log('   sudo ln -sf /etc/nginx/sites-available/brokercloud /etc/nginx/sites-enabled/');
    console.log('   sudo systemctl reload nginx');
    console.log('   sudo certbot --nginx\n');
  } catch (err) {
    console.error('\n❌ Erro durante o build:', err.message);
  }

  rl.close();
}

run();
