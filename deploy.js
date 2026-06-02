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
  const isDocker = ['s', 'sim', 'y', 'yes'].includes(useDocker.trim().toLowerCase());

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

  // ─── 4. Supabase Storage (Upload de Imagens) ──────────────────────────────────
  console.log('\n📌 ETAPA 4/5 — SUPABASE STORAGE (Otimização WebP)\n');
  const supabaseUrl = await askQuestion('👉 Supabase URL (ex: https://[ref].supabase.co): ');
  const supabaseAnonKey = await askQuestion('👉 Supabase Anon Key: ');

  // ─── 5. Evolution Go (WhatsApp) ────────────────────────────────────────────────
  console.log('\n📌 ETAPA 5/5 — WHATSAPP (Evolution Go)\n');
  const useEvolution = await askQuestion('👉 Deseja instalar o Evolution Go junto via Docker? (S/N) ');
  const isEvolutionDocker = ['s', 'sim', 'y', 'yes'].includes(useEvolution.trim().toLowerCase());
  
  let evolutionDomain = '';
  let evolutionUrl = '';
  let evolutionKey = crypto.randomBytes(24).toString('hex');
  let evoPort = 8080;

  if (isEvolutionDocker) {
    evolutionDomain = await askQuestion('👉 Qual o domínio/subdomínio exclusivo do WhatsApp? (ex: zap.brokercloud.com.br): ');
    evolutionDomain = evolutionDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    evolutionUrl = `https://${evolutionDomain}`;
    console.log('\n🔍 Buscando porta livre para a Evolution Go...');
    evoPort = await getFreePort(8080);
    console.log(`✅ Evolution Go rodará na porta: ${evoPort}`);
  } else {
    const hasExternal = await askQuestion('👉 Você já tem uma Evolution API rodando externamente? (S/N) ');
    if (hasExternal.trim().toLowerCase() === 's') {
      evolutionUrl = await askQuestion('👉 URL externa da Evolution API: ');
      evolutionKey = await askQuestion('👉 Global API Key da Evolution: ');
    }
  }

  // ─── Atualizar o docker-compose.yml ──────────────────────────────────────────
  if (isDocker || isEvolutionDocker) {
    let composeContent = `services:\n`;
    
    if (isDocker) {
      composeContent += `  postgres:
    image: postgres:16-alpine
    container_name: brokercloud_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: brokercloud
      POSTGRES_PASSWORD: brokercloud_dev_pass
      POSTGRES_DB: brokercloud
    ports:
      - "\${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brokercloud -d brokercloud"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: brokercloud_redis
    restart: unless-stopped
    ports:
      - "\${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5\n\n`;
    }

    if (isEvolutionDocker) {
      const dbUri = isDocker ? `postgresql://brokercloud:brokercloud_dev_pass@postgres:5432/brokercloud` : dbUrl;
      const rdsUri = isDocker ? `redis://redis:6379` : redisUrl;
      const apiUrlWebhook = domain === 'localhost' ? `http://host.docker.internal:${apiPort}` : `https://${apiDomain}`;

      composeContent += `  evolution:
    image: evoapicloud/evolution-go:latest
    container_name: brokercloud_evolution
    restart: unless-stopped
    ports:
      - "\${EVO_PORT:-8080}:8080"
    environment:
      - SERVER_PORT=8080
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=${dbUri}
      - REDIS_URI=${rdsUri}
      - GLOBAL_API_KEY=${evolutionKey}
      - WEBHOOK_GLOBAL_URL=${apiUrlWebhook}/webhook/evolution
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_EVENTS_MESSAGES_UPSERT=true
      - WEBHOOK_EVENTS_MESSAGES_UPDATE=true
      - WEBHOOK_EVENTS_SEND_MESSAGE=true\n`;
      
      if (isDocker) {
        composeContent += `    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy\n\n`;
      }
    }

    if (isDocker) {
      composeContent += `volumes:\n  postgres_data:\n  redis_data:\n`;
    }
    fs.writeFileSync(path.join(__dirname, 'docker-compose.yml'), composeContent);
    console.log('✅ docker-compose.yml atualizado com sucesso!');
  }

  // Se escolheu Docker, tem que subir agora (o compose atualizado)
  if (isDocker || isEvolutionDocker) {
    console.log('\n🐳 Subindo contêineres do Docker em background...');
    fs.writeFileSync(path.join(__dirname, '.env'), `DB_PORT=${isDocker ? dbUrl.split(':')[3].split('/')[0] : 5432}\nREDIS_PORT=${isDocker ? redisUrl.split(':')[2] : 6379}\nEVO_PORT=${evoPort}\n`);
    try {
      execSync('docker compose up -d', { cwd: __dirname, stdio: 'inherit' });
      console.log('⏳ Aguardando 5 segundos para inicialização...');
      execSync('sleep 5');
    } catch (err) {
      console.error('❌ Falha ao iniciar Docker.', err.message);
    }
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

  // Supabase (Backend não usa mais, mas podemos deixar guardado se necessário)
  // if (supabaseUrl.trim()) apiEnv = setEnvVar(apiEnv, 'SUPABASE_URL', supabaseUrl.trim());
  
  // Limpar R2 antigo
  apiEnv = apiEnv.replace(/^R2_.*$/gm, '');

  // Evolution API
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_URL', evolutionUrl.trim() || 'https://sua-instancia-evolution.com');
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_KEY', evolutionKey.trim());

  fs.writeFileSync(apiEnvPath, apiEnv);

  // ─── Montar o .env.local do Web ──────────────────────────────────────────────
  const webEnvPath = path.join(__dirname, 'web', '.env.local');
  const apiUrl = domain === 'localhost' ? `http://localhost:${apiPort}` : `https://${apiDomain}`;
  
  let webEnv = `NEXT_PUBLIC_API_URL=${apiUrl}\n`;
  if (supabaseUrl.trim()) webEnv += `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}\n`;
  if (supabaseAnonKey.trim()) webEnv += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey.trim()}\n`;
  
  fs.writeFileSync(webEnvPath, webEnv);



  console.log('✅ Arquivos .env atualizados!');

  // ─── Gerar Nginx ──────────────────────────────────────────────────────────────
  console.log('\n⚙️  Gerando configurações para a VPS...');

  if (domain !== 'localhost') {
    let nginxConf = `
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

    if (isEvolutionDocker && evolutionDomain) {
      nginxConf += `
# Evolution Go API
server {
    listen 80;
    server_name ${evolutionDomain};
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${evoPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;
    }

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
    console.log('➜ Instalando dependências da API...');
    execSync('npm install', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Preparando o Banco de Dados (Prisma)...');
    execSync('npx prisma generate', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });
    execSync('npx prisma migrate deploy', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Construindo API...');
    execSync('npm run build', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Instalando dependências do Web...');
    execSync('npm install', { cwd: path.join(__dirname, 'web'), stdio: 'inherit' });

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
