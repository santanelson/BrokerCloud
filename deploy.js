const fs = require('fs');
const path = require('path');
const readline = require('readline');
const net = require('net');
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

async function run() {
  console.log('\n🚀 --- INICIANDO CONFIGURAÇÃO DE DEPLOY --- 🚀\n');

  let domain = await askQuestion('👉 Qual o seu domínio principal (ex: brokercloud.com.br)? ');
  domain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!domain) {
    console.log('Domínio inválido! Usando localhost como padrão.');
    domain = 'localhost';
  }

  const useDocker = await askQuestion('👉 Deseja subir o PostgreSQL e Redis isolados usando Docker agora? (S/N) ');
  const isDocker = useDocker.trim().toLowerCase() === 's';

  let dbUrl = '';
  let redisUrl = '';

  const apiDomain = domain === 'localhost' ? 'localhost' : `api.${domain}`;
  
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
    
    // Configura as URLs para a API apontarem para as portas locais do Docker
    dbUrl = `postgresql://brokercloud:brokercloud_dev_pass@localhost:${dbPort}/brokercloud`;
    redisUrl = `redis://localhost:${redisPort}`;

    // Escreve um .env na raiz para o docker-compose ler
    fs.writeFileSync(path.join(__dirname, '.env'), `DB_PORT=${dbPort}\nREDIS_PORT=${redisPort}\n`);
    
    console.log('\n🐳 Subindo contêineres do Docker em background...');
    try {
      execSync('docker compose up -d', { cwd: __dirname, stdio: 'inherit' });
      // Aguardar o banco subir
      console.log('⏳ Aguardando 5 segundos para o banco iniciar completamente...');
      execSync('sleep 5');
    } catch (err) {
      console.error('❌ Falha ao iniciar Docker. Tem certeza que o Docker/Docker Compose está instalado?');
    }
  } else {
    dbUrl = await askQuestion('👉 Qual a URL do banco PostgreSQL na VPS? (Aperte Enter para ignorar) ');
    redisUrl = await askQuestion('👉 Qual a URL do Redis na VPS? (Aperte Enter para ignorar) ');
  }

  console.log('\n📝 Atualizando variáveis de ambiente (.env)...');

  // Atualizar API .env
  const apiEnvPath = path.join(__dirname, 'api', '.env');
  const apiEnvExamplePath = path.join(__dirname, 'api', '.env.example');
  let apiEnv = '';
  
  if (fs.existsSync(apiEnvPath)) {
    apiEnv = fs.readFileSync(apiEnvPath, 'utf8');
  } else if (fs.existsSync(apiEnvExamplePath)) {
    apiEnv = fs.readFileSync(apiEnvExamplePath, 'utf8');
    console.log('➜ Criado api/.env a partir do .env.example');
  }
  
  // Atualizar PORT, FRONTEND_URL na API
  apiEnv = apiEnv.replace(/^PORT=.*$/m, `PORT=${apiPort}`);
  if (!apiEnv.includes('PORT=')) apiEnv += `\nPORT=${apiPort}`;
  
  const frontendUrl = domain === 'localhost' ? `http://localhost:${webPort}` : `https://${domain}`;
  apiEnv = apiEnv.replace(/^FRONTEND_URL=.*$/m, `FRONTEND_URL="${frontendUrl}"`);
  if (!apiEnv.includes('FRONTEND_URL=')) apiEnv += `\nFRONTEND_URL="${frontendUrl}"`;

  // Atualizar DB e Redis
  if (dbUrl.trim() !== '') {
    apiEnv = apiEnv.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${dbUrl.trim()}"`);
    if (!apiEnv.includes('DATABASE_URL=')) apiEnv += `\nDATABASE_URL="${dbUrl.trim()}"`;
  }
  if (redisUrl.trim() !== '') {
    apiEnv = apiEnv.replace(/^REDIS_URL=.*$/m, `REDIS_URL="${redisUrl.trim()}"`);
    if (!apiEnv.includes('REDIS_URL=')) apiEnv += `\nREDIS_URL="${redisUrl.trim()}"`;
  }

  fs.writeFileSync(apiEnvPath, apiEnv);

  // Atualizar Web .env.local
  const webEnvPath = path.join(__dirname, 'web', '.env.local');
  let webEnv = '';
  if (fs.existsSync(webEnvPath)) {
    webEnv = fs.readFileSync(webEnvPath, 'utf8');
  }

  const apiUrl = domain === 'localhost' ? `http://localhost:${apiPort}` : `https://${apiDomain}`;
  webEnv = webEnv.replace(/^NEXT_PUBLIC_API_URL=.*$/m, `NEXT_PUBLIC_API_URL=${apiUrl}`);
  if (!webEnv.includes('NEXT_PUBLIC_API_URL=')) webEnv += `\nNEXT_PUBLIC_API_URL=${apiUrl}`;

  fs.writeFileSync(webEnvPath, webEnv);

  console.log('✅ Arquivos .env atualizados!');

  console.log('\n⚙️  Gerando configurações para a VPS...');

  // Gerar NGINX
  if (domain !== 'localhost') {
    const nginxConf = `
# Arquivo gerado para Nginx
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

  // Gerar ecosystem.config.js para PM2
  const pm2Config = `
module.exports = {
  apps: [
    {
      name: 'brokercloud-api',
      script: 'npm',
      args: 'run start --prefix api',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'brokercloud-web',
      script: 'npm',
      args: 'run start --prefix web',
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

  console.log('\n🔨 Construindo o projeto (Build)... Pode demorar alguns minutos...');
  
  try {
    console.log('➜ Preparando o Banco de Dados (Prisma)...');
    execSync('npx prisma generate', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });
    execSync('npx prisma migrate deploy', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });

    console.log('➜ Construindo API...');
    execSync('npm run build', { cwd: path.join(__dirname, 'api'), stdio: 'inherit' });
    
    console.log('➜ Construindo Web (Next.js)...');
    execSync('npm run build', { cwd: path.join(__dirname, 'web'), stdio: 'inherit' });
    
    console.log('\n🎉 BUILD CONCLUÍDO COM SUCESSO! 🎉\n');
    console.log('Para colocar no ar agora na sua VPS:');
    console.log('1. Instale o PM2 se não tiver: npm install -g pm2');
    console.log('2. Inicie os servidores: pm2 start ecosystem.config.js');
    console.log('3. Copie o conteúdo de nginx.conf para o seu Nginx e rode: certbot --nginx\n');
  } catch (err) {
    console.error('\n❌ Erro durante o build:', err.message);
  }

  rl.close();
}

run();
