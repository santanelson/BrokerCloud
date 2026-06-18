const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const net = require('net')
const readline = require('readline/promises')
const { stdin: input, stdout: output } = require('process')
const { spawnSync } = require('child_process')

const root = __dirname
const rootEnvPath = path.join(root, '.env')
const apiEnvPath = path.join(root, 'api', '.env')

const requiredRootEnv = [
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'WEB_PORT',
  'API_PORT',
  'DB_PORT',
  'REDIS_PORT',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_SOCKET_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

const requiredApiEnv = [
  'NODE_ENV',
  'PORT',
  'HOST',
  'DATABASE_URL',
  'REDIS_URL',
  'API_PUBLIC_URL',
  'FRONTEND_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'EVOLUTION_API_URL',
  'EVOLUTION_API_KEY',
]

function getPortChecks(env = {}) {
  return [
    { service: 'web', host: '0.0.0.0', port: Number(env.WEB_PORT || 3000), allowedContainers: ['brokercloud_web'] },
    { service: 'api', host: '0.0.0.0', port: Number(env.API_PORT || 3001), allowedContainers: ['brokercloud_api'] },
    { service: 'postgres', host: '127.0.0.1', port: Number(env.DB_PORT || 5432), allowedContainers: ['brokercloud_db'] },
    { service: 'redis', host: '127.0.0.1', port: Number(env.REDIS_PORT || 6379), allowedContainers: ['brokercloud_redis'] },
  ]
}

function generateSecret() {
  return crypto.randomBytes(48).toString('base64url')
}

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return null

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

function writeEnv(filePath, sections) {
  const lines = []

  for (const section of sections) {
    lines.push(`# ${section.title}`)
    for (const [key, value] of Object.entries(section.values)) {
      lines.push(`${key}=${formatEnvValue(value)}`)
    }
    lines.push('')
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
}

function formatEnvValue(value) {
  const stringValue = String(value ?? '')
  if (!stringValue) return ''
  if (/[\s#"'`$\\]/.test(stringValue)) return JSON.stringify(stringValue)
  return stringValue
}

function fail(message) {
  console.error(`\nDeploy bloqueado: ${message}`)
  process.exit(1)
}

function warn(message) {
  console.warn(`Aviso: ${message}`)
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    ...options,
  })

  if (result.error) fail(`falha ao executar ${command}: ${result.error.message}`)
  if (result.status !== 0) fail(`${command} ${args.join(' ')} retornou codigo ${result.status}`)
}

function capture(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    ...options,
  })

  if (result.error || result.status !== 0) return ''
  return result.stdout || ''
}

function checkRequired(env, fileLabel, keys) {
  const missing = keys.filter((key) => !env[key])
  if (missing.length) {
    fail(`${fileLabel} sem variaveis obrigatorias: ${missing.join(', ')}`)
  }
}

async function ask(rl, label, defaultValue = '') {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  const answer = await rl.question(`${label}${suffix}: `)
  return answer.trim() || defaultValue
}

async function askRequired(rl, label, defaultValue = '') {
  while (true) {
    const value = await ask(rl, label, defaultValue)
    if (value) return value
    console.log('Valor obrigatorio.')
  }
}

async function askPort(rl, label, defaultValue) {
  while (true) {
    const value = await askRequired(rl, label, String(defaultValue))
    const port = Number(value)
    if (Number.isInteger(port) && port > 0 && port < 65536) return String(port)
    console.log('Porta invalida. Use um numero entre 1 e 65535.')
  }
}

async function confirm(rl, label, defaultYes = true) {
  const suffix = defaultYes ? '[S/n]' : '[s/N]'
  const answer = (await rl.question(`${label} ${suffix}: `)).trim().toLowerCase()
  if (!answer) return defaultYes
  return ['s', 'sim', 'y', 'yes'].includes(answer)
}

async function setupEnv() {
  const rl = readline.createInterface({ input, output })
  const existingRoot = readEnv(rootEnvPath) || {}
  const existingApi = readEnv(apiEnvPath) || {}

  try {
    console.log('\nBrokerCloud setup de ambiente')
    console.log('Isso vai criar/atualizar .env e api/.env. Segredos gerados automaticamente podem ser aceitos apertando Enter.\n')

    await scanPorts(existingRoot, { block: false })
    console.log('')

    if (fs.existsSync(rootEnvPath)) {
      const overwrite = await confirm(rl, '.env da raiz ja existe. Atualizar mantendo valores atuais como default?', true)
      if (!overwrite) fail('setup cancelado pelo usuario')
    }

    if (fs.existsSync(apiEnvPath)) {
      const overwrite = await confirm(rl, 'api/.env ja existe. Atualizar mantendo valores atuais como default?', true)
      if (!overwrite) fail('setup cancelado pelo usuario')
    }

    const webUrl = await askRequired(rl, 'URL publica do web app (FRONTEND_URL)', existingApi.FRONTEND_URL || 'https://app.seudominio.com.br')
    const apiUrl = await askRequired(rl, 'URL publica da API (API_PUBLIC_URL)', existingApi.API_PUBLIC_URL || existingRoot.NEXT_PUBLIC_API_URL || 'https://api.seudominio.com.br')

    const dbUser = await askRequired(rl, 'Postgres DB_USER', existingRoot.DB_USER || 'brokercloud')
    const dbPass = await askRequired(rl, 'Postgres DB_PASS', existingRoot.DB_PASS || crypto.randomBytes(18).toString('base64url'))
    const dbName = await askRequired(rl, 'Postgres DB_NAME', existingRoot.DB_NAME || 'brokercloud')
    const webPort = await askPort(rl, 'Porta externa do web container (WEB_PORT)', existingRoot.WEB_PORT || '3000')
    const apiPort = await askPort(rl, 'Porta externa da API (API_PORT)', existingRoot.API_PORT || '3001')
    const dbPort = await askPort(rl, 'Porta local do Postgres (DB_PORT)', existingRoot.DB_PORT || '5432')
    const redisPort = await askPort(rl, 'Porta local do Redis (REDIS_PORT)', existingRoot.REDIS_PORT || '6379')

    const supabaseUrl = await askRequired(rl, 'NEXT_PUBLIC_SUPABASE_URL', existingRoot.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co')
    const supabaseAnonKey = await askRequired(rl, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', existingRoot.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const supabaseServiceRoleKey = await askRequired(rl, 'SUPABASE_SERVICE_ROLE_KEY', existingApi.SUPABASE_SERVICE_ROLE_KEY || '')

    const evolutionUrl = await askRequired(rl, 'EVOLUTION_API_URL', existingApi.EVOLUTION_API_URL || 'https://zap.seudominio.com.br')
    const evolutionKey = await askRequired(rl, 'EVOLUTION_API_KEY', existingApi.EVOLUTION_API_KEY || '')

    const jwtSecret = await askRequired(rl, 'JWT_SECRET', existingApi.JWT_SECRET || generateSecret())
    const jwtRefreshSecret = await askRequired(rl, 'JWT_REFRESH_SECRET', existingApi.JWT_REFRESH_SECRET || generateSecret())

    const rootValues = {
      DB_USER: dbUser,
      DB_PASS: dbPass,
      DB_NAME: dbName,
      WEB_PORT: webPort,
      API_PORT: apiPort,
      DB_PORT: dbPort,
      REDIS_PORT: redisPort,
      NEXT_PUBLIC_API_URL: apiUrl,
      NEXT_PUBLIC_SOCKET_URL: apiUrl,
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    }

    const apiValues = {
      NODE_ENV: 'production',
      PORT: existingApi.PORT || '3001',
      HOST: existingApi.HOST || '0.0.0.0',
      DATABASE_URL: `postgresql://${dbUser}:${dbPass}@db:5432/${dbName}?schema=public`,
      JWT_SECRET: jwtSecret,
      JWT_EXPIRES_IN: existingApi.JWT_EXPIRES_IN || '15m',
      JWT_REFRESH_SECRET: jwtRefreshSecret,
      JWT_REFRESH_EXPIRES_IN: existingApi.JWT_REFRESH_EXPIRES_IN || '7d',
      REDIS_URL: 'redis://redis:6379',
      SUPABASE_URL: existingApi.SUPABASE_URL || supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
      EVOLUTION_API_URL: evolutionUrl,
      EVOLUTION_API_KEY: evolutionKey,
      API_PUBLIC_URL: apiUrl,
      FRONTEND_URL: webUrl,
    }

    writeEnv(rootEnvPath, [
      { title: 'Database usado pelo docker-compose', values: pick(rootValues, ['DB_USER', 'DB_PASS', 'DB_NAME']) },
      { title: 'Portas publicadas na VPS', values: pick(rootValues, ['WEB_PORT', 'API_PORT', 'DB_PORT', 'REDIS_PORT']) },
      { title: 'Variaveis publicas do Next.js usadas no build do web', values: pick(rootValues, ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SOCKET_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']) },
    ])

    writeEnv(apiEnvPath, [
      { title: 'Server', values: pick(apiValues, ['NODE_ENV', 'PORT', 'HOST', 'API_PUBLIC_URL', 'FRONTEND_URL']) },
      { title: 'Database e Redis dentro do Docker', values: pick(apiValues, ['DATABASE_URL', 'REDIS_URL']) },
      { title: 'Auth', values: pick(apiValues, ['JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRES_IN']) },
      { title: 'Supabase Storage', values: pick(apiValues, ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) },
      { title: 'Evolution Go API', values: pick(apiValues, ['EVOLUTION_API_URL', 'EVOLUTION_API_KEY']) },
    ])

    console.log('\nArquivos criados/atualizados:')
    console.log(`- ${rootEnvPath}`)
    console.log(`- ${apiEnvPath}`)
    console.log('\nRodando preflight...')
    await preflight()
    console.log('Setup ok.')
  } finally {
    rl.close()
  }
}

function pick(source, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = source[key]
    return acc
  }, {})
}

function canBindPort(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen({ host, port, exclusive: true })
  })
}

function dockerPortOwners(port) {
  const output = capture('docker', ['ps', '--format', '{{.Names}}|{{.Ports}}'])
  if (!output) return []

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [name, ports = ''] = line.split('|')
      return { name, ports }
    })
    .filter(({ ports }) => {
      return (
        ports.includes(`:${port}->`) ||
        ports.includes(`0.0.0.0:${port}->`) ||
        ports.includes(`127.0.0.1:${port}->`) ||
        ports.includes(`[::]:${port}->`)
      )
    })
}

async function scanPorts(env = readEnv(rootEnvPath) || {}, options = {}) {
  const { block = true } = options
  console.log('\nScan de portas da VPS')

  const conflicts = []

  for (const check of getPortChecks(env)) {
    if (!Number.isInteger(check.port) || check.port <= 0 || check.port >= 65536) {
      conflicts.push(`${check.service} tem porta invalida: ${check.port}`)
      continue
    }

    const available = await canBindPort(check.host, check.port)
    if (available) {
      console.log(`- ${check.service}: ${check.host}:${check.port} livre`)
      continue
    }

    const owners = dockerPortOwners(check.port)
    const allowed = owners.some((owner) => check.allowedContainers.includes(owner.name))

    if (allowed) {
      console.log(`- ${check.service}: ${check.host}:${check.port} ocupado pelo proprio BrokerCloud (${owners.map((owner) => owner.name).join(', ')})`)
      continue
    }

    const ownerLabel = owners.length
      ? owners.map((owner) => `${owner.name} [${owner.ports}]`).join('; ')
      : 'processo fora do Docker ou sem permissao para identificar'

    conflicts.push(`${check.service} precisa de ${check.host}:${check.port}, mas esta ocupado por ${ownerLabel}`)
  }

  if (conflicts.length && block) {
    fail(`conflito de portas encontrado:\n- ${conflicts.join('\n- ')}`)
  }

  if (conflicts.length) {
    console.log('Conflitos encontrados:')
    for (const conflict of conflicts) console.log(`- ${conflict}`)
    console.log('Escolha portas alternativas no setup para evitar conflito.')
    return false
  }

  console.log('Scan de portas ok.')
  return true
}

async function preflight() {
  const composePath = path.join(root, 'docker-compose.yml')
  const rootEnv = readEnv(rootEnvPath)
  const apiEnv = readEnv(apiEnvPath)

  if (!rootEnv) fail('crie .env na raiz usando .env.example como base ou rode node deploy.js --setup')
  if (!apiEnv) fail('crie api/.env usando api/.env.example como base ou rode node deploy.js --setup')
  if (!fs.existsSync(composePath)) fail('docker-compose.yml nao encontrado')

  checkRequired(rootEnv, '.env', requiredRootEnv)
  checkRequired(apiEnv, 'api/.env', requiredApiEnv)

  if (rootEnv.NEXT_PUBLIC_API_URL.includes('localhost')) {
    warn('NEXT_PUBLIC_API_URL aponta para localhost; na VPS use o dominio publico da API')
  }

  if (rootEnv.NEXT_PUBLIC_SOCKET_URL.includes('localhost')) {
    warn('NEXT_PUBLIC_SOCKET_URL aponta para localhost; na VPS use o dominio publico da API/socket')
  }

  if (apiEnv.API_PUBLIC_URL.includes('localhost')) {
    warn('API_PUBLIC_URL aponta para localhost; webhooks da Evolution precisam de URL publica')
  }

  if (apiEnv.FRONTEND_URL.includes('localhost')) {
    warn('FRONTEND_URL aponta para localhost; em producao use o dominio do web app')
  }

  if (apiEnv.JWT_SECRET.includes('mude') || apiEnv.JWT_REFRESH_SECRET.includes('mude')) {
    fail('JWT_SECRET/JWT_REFRESH_SECRET ainda parecem placeholders')
  }

  run('docker', ['compose', 'config', '--quiet'])
  await scanPorts(rootEnv)
}

async function main() {
  const args = new Set(process.argv.slice(2))

  if (args.has('--setup') || args.has('--init')) {
    await setupEnv()
    return
  }

  if (args.has('--scan-ports')) {
    await scanPorts()
    return
  }

  await preflight()

  if (args.has('--check')) {
    console.log('Preflight ok.')
    return
  }

  if (args.has('--build-only')) {
    run('docker', ['compose', 'build'])
    return
  }

  const composeArgs = ['compose', 'up', '-d']
  if (!args.has('--no-build')) composeArgs.push('--build')

  run('docker', composeArgs)
  run('docker', ['compose', 'ps'])
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
