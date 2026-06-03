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

let isDockerStarted = false;

function cleanupAndExit() {
  console.log('\n\n🛑 Script cancelado! Desfazendo alterações e limpando arquivos gerados...');

  const filesToDelete = [
    path.join(__dirname, 'docker-compose.yml'),
    path.join(__dirname, '.env'),
    path.join(__dirname, 'api', '.env'),
    path.join(__dirname, 'web', '.env.local'),
    path.join(__dirname, 'nginx.conf'),
    path.join(__dirname, 'ecosystem.config.js'),
    path.join(__dirname, 'credentials.txt')
  ];

  filesToDelete.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`🗑️  Excluído: ${path.basename(file)}`);
      } catch (err) { }
    }
  });

  if (isDockerStarted) {
    console.log('🐳 Derrubando contêineres do Docker gerados...');
    try {
      execSync('docker compose down -v', { cwd: __dirname, stdio: 'ignore' });
      console.log('✅ Contêineres removidos.');
    } catch (err) { }
  }

  console.log('Limpeza concluída. Saindo...');
  process.exit(1);
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

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

// Helper: escapa argumentos para comandos shell
function shellArg(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

function sleepSeconds(seconds) {
  execSync(`sleep ${seconds}`);
}

function waitForDockerPostgres(dbUser, dbName, timeoutSeconds = 60) {
  console.log('⏳ Aguardando PostgreSQL ficar pronto...');

  const maxAttempts = Math.ceil(timeoutSeconds / 2);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      execSync(
        `docker exec brokercloud_postgres pg_isready -U ${shellArg(dbUser)} -d ${shellArg(dbName)}`,
        { stdio: 'ignore' }
      );

      console.log('✅ PostgreSQL pronto.');
      return;
    } catch (err) {
      sleepSeconds(2);
    }
  }

  throw new Error('PostgreSQL não ficou pronto dentro do tempo esperado. Verifique: docker logs brokercloud_postgres');
}

function ensureDockerDatabase(dbUser, databaseName) {
  try {
    execSync(
      `docker exec brokercloud_postgres createdb -U ${shellArg(dbUser)} ${shellArg(databaseName)}`,
      { stdio: 'ignore' }
    );

    console.log(`✅ Banco auxiliar criado: ${databaseName}`);
  } catch (err) {
    console.log(`ℹ️  Banco auxiliar já existe ou não precisou ser criado: ${databaseName}`);
  }
}

function execCapture(command, options = {}) {
  try {
    const output = execSync(command, {
      ...options,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    if (output) process.stdout.write(output);

    return {
      ok: true,
      output
    };
  } catch (err) {
    const output = `${err.stdout ? err.stdout.toString() : ''}${err.stderr ? err.stderr.toString() : ''}`;

    if (output) process.stderr.write(output);

    return {
      ok: false,
      output,
      error: err
    };
  }
}

function listPrismaMigrations(apiDir) {
  const migrationsDir = path.join(apiDir, 'prisma', 'migrations');

  if (!fs.existsSync(migrationsDir)) return [];

  return fs.readdirSync(migrationsDir)
    .filter((name) => {
      const fullPath = path.join(migrationsDir, name);
      return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'migration.sql'));
    })
    .sort();
}

async function runPrismaMigrateDeployWithRecovery(apiDir, apiEnvVars, isDocker, dbUser, dbName, extraDatabaseName = null) {
  const result = execCapture('npx prisma migrate deploy', {
    cwd: apiDir,
    env: apiEnvVars
  });

  if (result.ok) return;

  const isP3005 =
    result.output.includes('P3005') ||
    result.output.includes('database schema is not empty');

  if (!isP3005) {
    throw result.error;
  }

  console.log('\n⚠️  O Prisma encontrou um banco que já tem tabelas, mas não tem histórico de migrations.');
  console.log('Isso normalmente acontece quando:');
  console.log('1. você já rodou esse deploy antes e o volume Docker ficou salvo;');
  console.log('2. você usou prisma db push antes;');
  console.log('3. outro serviço criou tabelas no mesmo schema public.');

  if (isDocker) {
    const reset = await askQuestion('\n🧨 É ambiente novo/teste e pode APAGAR o banco Docker para recriar do zero? (S/N) ');

    if (['s', 'sim', 'y', 'yes'].includes(reset.trim().toLowerCase())) {
      console.log('\n🧹 Apagando volume Docker do banco e subindo novamente...');

      execSync('docker compose down -v', {
        cwd: path.dirname(apiDir),
        stdio: 'inherit'
      });

      execSync('docker compose up -d postgres redis', {
        cwd: path.dirname(apiDir),
        stdio: 'inherit'
      });

      waitForDockerPostgres(dbUser, dbName);

      if (extraDatabaseName) {
        ensureDockerDatabase(dbUser, extraDatabaseName);
      }

      const retry = execCapture('npx prisma migrate deploy', {
        cwd: apiDir,
        env: apiEnvVars
      });

      if (retry.ok) return;

      throw retry.error;
    }
  }

  console.log('\n🧩 Opção segura para banco existente: baseline.');
  console.log('Use APENAS se as tabelas do BrokerCloud já existem nesse banco e você só quer marcar a migration como aplicada.');

  const baseline = await askQuestion('👉 Marcar as migrations atuais como já aplicadas e continuar? (S/N) ');

  if (['s', 'sim', 'y', 'yes'].includes(baseline.trim().toLowerCase())) {
    const migrations = listPrismaMigrations(apiDir);

    if (!migrations.length) {
      throw new Error('Nenhuma migration encontrada em api/prisma/migrations.');
    }

    for (const migration of migrations) {
      console.log(`➜ Marcando migration como aplicada: ${migration}`);

      execSync(`npx prisma migrate resolve --applied ${shellArg(migration)}`, {
        cwd: apiDir,
        stdio: 'inherit',
        env: apiEnvVars
      });
    }

    const retry = execCapture('npx prisma migrate deploy', {
      cwd: apiDir,
      env: apiEnvVars
    });

    if (retry.ok) return;

    throw retry.error;
  }

  throw new Error('Deploy interrompido para não mexer em um banco existente sem confirmação.');
}

async function run() {
  console.log('\n🚀 ═══════════════════════════════════════════════════════════');
  console.log('       BROKERCLOUD — ASSISTENTE DE DEPLOY COMPLETO');
  console.log('═══════════════════════════════════════════════════════════ 🚀\n');

  // ─── 1. Domínio ──────────────────────────────────────────────────────────────
  console.log('📌 ETAPA 1/5 — DOMÍNIO\n');

  let domain = await askQuestion('👉 Qual o domínio/subdomínio do PAINEL WEB (ex: painel.brokercloud.com.br)? ');
  domain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!domain) {
    console.log('Domínio inválido! Usando localhost como padrão.');
    domain = 'localhost';
  }

  let apiDomain = 'localhost';

  if (domain !== 'localhost') {
    apiDomain = await askQuestion('👉 Qual o domínio/subdomínio da API (ex: api.brokercloud.com.br)? ');
    apiDomain = apiDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || `api.${domain}`;
  }

  // ─── 2. Infraestrutura (Docker / Manual) ──────────────────────────────────────
  console.log('\n📌 ETAPA 2/5 — INFRAESTRUTURA (Banco de Dados & Redis)\n');

  const useDocker = await askQuestion('👉 Deseja subir o PostgreSQL e Redis isolados usando Docker agora? (S/N) ');
  const isDocker = ['s', 'sim', 'y', 'yes'].includes(useDocker.trim().toLowerCase());

  let dbUrl = '';
  let redisUrl = '';
  let dbPort = 5432;
  let redisPort = 6379;

  let dbUser = 'brokercloud';
  let dbPass = 'brokercloud_dev_pass';
  let dbName = 'brokercloud';

  console.log('\n🔍 Buscando portas disponíveis no servidor...');

  const apiPort = await getFreePort(3001);
  const webPort = await getFreePort(3000);

  console.log(`✅ API rodará na porta: ${apiPort}`);
  console.log(`✅ Web rodará na porta: ${webPort}`);

  if (isDocker) {
    dbPort = await getFreePort(5440);
    redisPort = await getFreePort(6380);

    console.log(`✅ Docker Postgres rodará na porta: ${dbPort}`);
    console.log(`✅ Docker Redis rodará na porta: ${redisPort}`);

    const customDb = await askQuestion('👉 Deseja customizar usuário/senha/nome do Banco de Dados? (S/N - Padrão é N): ');

    if (['s', 'sim', 'y', 'yes'].includes(customDb.trim().toLowerCase())) {
      dbUser = await askQuestion('   👤 Usuário do DB (ex: admin): ') || 'brokercloud';
      dbPass = await askQuestion('   🔑 Senha do DB: ') || 'brokercloud_dev_pass';
      dbName = await askQuestion('   🗄️  Nome do DB: ') || 'brokercloud';
    }

    dbUrl = `postgresql://${dbUser}:${dbPass}@127.0.0.1:${dbPort}/${dbName}`;
    redisUrl = `redis://127.0.0.1:${redisPort}`;

    fs.writeFileSync(path.join(__dirname, '.env'), `DB_PORT=${dbPort}
REDIS_PORT=${redisPort}
`);

    // IMPORTANTE:
    // Não subimos o Docker aqui.
    // Primeiro geramos o docker-compose.yml novo para evitar subir compose antigo/volume errado.
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

  const evolutionDbName = `${dbName}_evolution`;

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
      POSTGRES_USER: ${dbUser}
      POSTGRES_PASSWORD: ${dbPass}
      POSTGRES_DB: ${dbName}
    ports:
      - "\${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${dbUser} -d ${dbName}"]
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
      // A Evolution usa um banco separado para não criar tabelas no mesmo schema da API/Prisma.
      const dbUri = isDocker
        ? `postgresql://${dbUser}:${dbPass}@postgres:5432/${evolutionDbName}`
        : dbUrl;

      const apiUrlWebhook = domain === 'localhost'
        ? `http://host.docker.internal:${apiPort}`
        : `https://${apiDomain}`;

      composeContent += `  evolution:
    image: evoapicloud/evolution-go:latest
    container_name: brokercloud_evolution
    restart: unless-stopped
    ports:
      - "\${EVO_PORT:-8080}:8080"
    environment:
      - SERVER_PORT=8080
      - POSTGRES_AUTH_DB=${dbUri}?sslmode=disable
      - POSTGRES_USERS_DB=${dbUri}?sslmode=disable
      - DATABASE_SAVE_MESSAGES=false
      - GLOBAL_API_KEY=${evolutionKey}
      - WEBHOOK_GLOBAL_URL=${apiUrlWebhook}/webhooks/evolution
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

  // Se escolheu Docker, sobe agora com o compose atualizado
  if (isDocker || isEvolutionDocker) {
    console.log('\n🐳 Subindo contêineres do Docker em background...');

    fs.writeFileSync(path.join(__dirname, '.env'), `DB_PORT=${dbPort}
REDIS_PORT=${redisPort}
EVO_PORT=${evoPort}
`);

    try {
      isDockerStarted = true;

      if (isDocker) {
        execSync('docker compose up -d postgres redis', {
          cwd: __dirname,
          stdio: 'inherit'
        });

        waitForDockerPostgres(dbUser, dbName);

        if (isEvolutionDocker) {
          ensureDockerDatabase(dbUser, evolutionDbName);
        }
      } else {
        console.log('ℹ️  Docker do banco não foi escolhido; nenhum Postgres/Redis será iniciado pelo script.');
      }
    } catch (err) {
      console.error('❌ Falha ao iniciar Docker.', err.message);
      throw err;
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

  const frontendUrl = domain === 'localhost'
    ? `http://localhost:${webPort}`
    : `https://${domain}`;

  // Servidor
  apiEnv = setEnvVar(apiEnv, 'NODE_ENV', 'production');
  apiEnv = setEnvVar(apiEnv, 'PORT', apiPort);
  apiEnv = setEnvVar(apiEnv, 'HOST', '0.0.0.0');
  apiEnv = setEnvVar(apiEnv, 'FRONTEND_URL', frontendUrl);

  const apiPublicUrl = domain === 'localhost'
    ? `http://localhost:${apiPort}`
    : `https://${apiDomain}`;

  apiEnv = setEnvVar(apiEnv, 'API_PUBLIC_URL', apiPublicUrl);

  // Banco e Redis
  if (dbUrl.trim()) {
    apiEnv = setEnvVar(apiEnv, 'DATABASE_URL', dbUrl.trim());
  }

  if (redisUrl.trim()) {
    apiEnv = setEnvVar(apiEnv, 'REDIS_URL', redisUrl.trim());
  }

  // JWT
  apiEnv = setEnvVar(apiEnv, 'JWT_SECRET', jwtSecret);
  apiEnv = setEnvVar(apiEnv, 'JWT_EXPIRES_IN', '15m');
  apiEnv = setEnvVar(apiEnv, 'JWT_REFRESH_SECRET', jwtRefreshSecret);
  apiEnv = setEnvVar(apiEnv, 'JWT_REFRESH_EXPIRES_IN', '7d');

  // Supabase backend não usa mais, mas pode deixar guardado se quiser futuramente
  // if (supabaseUrl.trim()) {
  //   apiEnv = setEnvVar(apiEnv, 'SUPABASE_URL', supabaseUrl.trim());
  // }

  // Limpar R2 antigo
  apiEnv = apiEnv.replace(/^R2_.*$/gm, '');

  // Evolution API
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_URL', evolutionUrl.trim() || 'https://sua-instancia-evolution.com');
  apiEnv = setEnvVar(apiEnv, 'EVOLUTION_API_KEY', evolutionKey.trim());

  fs.writeFileSync(apiEnvPath, apiEnv);

  // ─── Montar o .env.local do Web ──────────────────────────────────────────────
  const webEnvPath = path.join(__dirname, 'web', '.env.local');

  const apiUrl = domain === 'localhost'
    ? `http://localhost:${apiPort}`
    : `https://${apiDomain}`;

  let webEnv = `NEXT_PUBLIC_API_URL=${apiUrl}\n`;

  if (supabaseUrl.trim()) {
    webEnv += `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}\n`;
  }

  if (supabaseAnonKey.trim()) {
    webEnv += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey.trim()}\n`;
  }

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
    const apiEnvVars = {
      ...process.env,
      DATABASE_URL: dbUrl.trim(),
      REDIS_URL: redisUrl.trim()
    };

    console.log('➜ Instalando dependências da API...');

    execSync('npm install', {
      cwd: path.join(__dirname, 'api'),
      stdio: 'inherit',
      env: apiEnvVars
    });

    console.log('➜ Preparando o Banco de Dados (Prisma)...');

    const apiDir = path.join(__dirname, 'api');

    execSync('npx prisma generate', {
      cwd: apiDir,
      stdio: 'inherit',
      env: apiEnvVars
    });

    await runPrismaMigrateDeployWithRecovery(
      apiDir,
      apiEnvVars,
      isDocker,
      dbUser,
      dbName,
      isEvolutionDocker ? evolutionDbName : null
    );

    console.log('➜ Construindo API...');

    execSync('npm run build', {
      cwd: path.join(__dirname, 'api'),
      stdio: 'inherit',
      env: apiEnvVars
    });

    console.log('➜ Instalando dependências do Web...');

    execSync('npm install', {
      cwd: path.join(__dirname, 'web'),
      stdio: 'inherit'
    });

    console.log('➜ Construindo Web (Next.js)...');

    execSync('npm run build', {
      cwd: path.join(__dirname, 'web'),
      stdio: 'inherit'
    });

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

    // ─── Gerar Documento de Credenciais ──────────────────────────────────────────
    console.log('\n📄 Gerando documento com as credenciais (credentials.txt)...');

    const credentialsContent = `
===========================================================
   BROKERCLOUD — CREDENCIAIS E DADOS DE ACESSO (MANTENHA SEGURO)
===========================================================

[DOMÍNIOS]
Painel Web: ${frontendUrl}
API: ${apiPublicUrl}

[BANCO DE DADOS POSTGRESQL]
URL de Conexão: ${dbUrl}
${isDocker ? `Database: ${dbName}\nUsuário: ${dbUser}\nSenha: ${dbPass}` : 'Credenciais externas fornecidas manualmente.'}

[REDIS]
URL de Conexão: ${redisUrl}

[WHATSAPP - EVOLUTION GO]
Domínio / URL: ${evolutionUrl || 'Não configurado via script'}
Global API Key: ${evolutionKey || 'Não configurada via script'}

[SEGURANÇA]
JWT Secret: ${jwtSecret}
JWT Refresh Secret: ${jwtRefreshSecret}

[SUPABASE]
URL: ${supabaseUrl || 'Não preenchido'}
Anon Key: ${supabaseAnonKey || 'Não preenchida'}
===========================================================
`;

    fs.writeFileSync(path.join(__dirname, 'credentials.txt'), credentialsContent.trim());

    console.log('✅ credentials.txt gerado com sucesso! Guarde este arquivo em um local seguro.');

    if (isEvolutionDocker) {
      console.log('\n🚀 Iniciando contêiner do Evolution Go...');

      try {
        execSync('docker compose up -d evolution', {
          cwd: __dirname,
          stdio: 'inherit'
        });

        console.log('✅ Evolution Go rodando perfeitamente!');
      } catch (err) {
        console.error('❌ Falha ao iniciar Evolution Go:', err.message);
      }
    }
  } catch (err) {
    console.error('\n❌ Erro durante o build:', err.message);
  }

  rl.close();
}

run();