const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = __dirname
const rootEnvPath = path.join(root, '.env')
const apiEnvPath = path.join(root, 'api', '.env')
const evolutionEnvPath = path.join(root, 'evolution', '.env')

const managedMarker = '# Managed by BrokerCloud deploy'
const configName = 'brokercloud.conf'
const nginxAvailableDir = '/etc/nginx/sites-available'
const nginxEnabledDir = '/etc/nginx/sites-enabled'

const brokerCloudConfigNames = new Set([
  'brokercloud',
  'brokercloud.conf',
  'brokercloud-api',
  'brokercloud-api.conf',
  'brokercloud-web',
  'brokercloud-web.conf',
  'brokercloud-evolution',
  'brokercloud-evolution.conf',
])

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const entries = {}
  const content = fs.readFileSync(filePath, 'utf8')

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const eq = line.indexOf('=')
    if (eq === -1) continue

    const key = line.slice(0, eq).trim()
    const value = line
      .slice(eq + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')

    entries[key] = value
  }

  return entries
}

function fail(message) {
  console.error(`\nNginx bloqueado: ${message}`)
  process.exit(1)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })

  if (result.error) fail(`falha ao executar ${command}: ${result.error.message}`)
  if (result.status !== 0) fail(`${command} ${args.join(' ')} retornou codigo ${result.status}`)
}

function parseHostname(url, label) {
  if (!url) fail(`${label} nao configurado`)

  try {
    const parsed = new URL(url)
    return parsed.hostname
  } catch {
    fail(`${label} invalido: ${url}`)
  }
}

function hasLocalhost(hostname) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname)
}

function buildServer({ label, hostname, port }) {
  return `server {
    listen 80;
    listen [::]:80;
    server_name ${hostname};

    access_log /var/log/nginx/brokercloud-${label}.access.log;
    error_log /var/log/nginx/brokercloud-${label}.error.log;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Real-IP $remote_addr;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}`
}

function getConfig() {
  const rootEnv = readEnv(rootEnvPath)
  const apiEnv = readEnv(apiEnvPath)
  const evolutionEnv = readEnv(evolutionEnvPath)

  const webHostname = parseHostname(apiEnv.FRONTEND_URL || rootEnv.FRONTEND_URL, 'FRONTEND_URL em api/.env')
  const apiHostname = parseHostname(apiEnv.API_PUBLIC_URL || rootEnv.NEXT_PUBLIC_API_URL, 'API_PUBLIC_URL em api/.env')
  const evolutionHostname = parseHostname(evolutionEnv.EVOLUTION_PUBLIC_URL || apiEnv.EVOLUTION_API_URL, 'EVOLUTION_PUBLIC_URL em evolution/.env ou EVOLUTION_API_URL em api/.env')

  const sites = [
    { label: 'web', hostname: webHostname, port: rootEnv.WEB_PORT || '3000' },
    { label: 'api', hostname: apiHostname, port: rootEnv.API_PORT || '3001' },
    { label: 'evolution', hostname: evolutionHostname, port: evolutionEnv.EVOLUTION_PORT || '8080' },
  ]

  const publicSites = sites.filter((site) => !hasLocalhost(site.hostname))
  if (!publicSites.length) {
    fail('nenhum dominio publico encontrado. Rode node deploy.js --setup e node install-evolution.js --setup antes de instalar o Nginx')
  }

  const skipped = sites.filter((site) => hasLocalhost(site.hostname))
  if (skipped.length) {
    console.warn(`Aviso: ignorando dominio local no Nginx: ${skipped.map((site) => `${site.label}=${site.hostname}`).join(', ')}`)
  }

  return `${managedMarker}
# File: /etc/nginx/sites-available/${configName}
# Generated from BrokerCloud .env files. Re-run node nginx.js --install after changing domains or ports.

${publicSites.map(buildServer).join('\n\n')}
`
}

function listCandidateFiles() {
  const files = []

  for (const dir of [nginxAvailableDir, nginxEnabledDir]) {
    if (!fs.existsSync(dir)) continue

    for (const name of fs.readdirSync(dir)) {
      const fullPath = path.posix.join(dir, name)
      if (!brokerCloudConfigNames.has(name)) {
        try {
          const stat = fs.lstatSync(fullPath)
          if (stat.isFile() && fs.readFileSync(fullPath, 'utf8').includes(managedMarker)) {
            files.push(fullPath)
          }
        } catch {
          continue
        }
        continue
      }

      files.push(fullPath)
    }
  }

  return [...new Set(files)]
}

function removeFile(filePath, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] removeria ${filePath}`)
    return
  }

  fs.rmSync(filePath, { force: true })
  console.log(`Removido ${filePath}`)
}

function installConfig({ dryRun = false, cleanupOnly = false } = {}) {
  const targets = listCandidateFiles()
  for (const target of targets) removeFile(target, dryRun)

  if (cleanupOnly) return

  const availablePath = path.posix.join(nginxAvailableDir, configName)
  const enabledPath = path.posix.join(nginxEnabledDir, configName)
  const config = getConfig()

  if (dryRun) {
    console.log(`[dry-run] escreveria ${availablePath}`)
    console.log(`[dry-run] criaria symlink ${enabledPath} -> ${availablePath}`)
    return
  }

  fs.writeFileSync(availablePath, config, 'utf8')
  try {
    fs.symlinkSync(availablePath, enabledPath)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }

  run('nginx', ['-t'])
  run('systemctl', ['reload', 'nginx'])
  console.log(`Nginx atualizado: ${availablePath}`)
}

function main() {
  const args = new Set(process.argv.slice(2))

  if (args.has('--print')) {
    process.stdout.write(getConfig())
    return
  }

  if (args.has('--list-managed')) {
    const files = listCandidateFiles()
    if (!files.length) {
      console.log('Nenhuma config BrokerCloud encontrada em /etc/nginx.')
      return
    }
    for (const file of files) console.log(file)
    return
  }

  if (args.has('--cleanup-managed')) {
    installConfig({ dryRun: args.has('--dry-run'), cleanupOnly: true })
    return
  }

  if (args.has('--install')) {
    installConfig({ dryRun: args.has('--dry-run') })
    return
  }

  console.log(`Uso:
  node nginx.js --print
  node nginx.js --list-managed
  sudo node nginx.js --cleanup-managed
  sudo node nginx.js --install

Use --dry-run junto com --cleanup-managed ou --install para simular.`)
}

main()
