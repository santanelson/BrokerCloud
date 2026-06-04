const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const net = require('net')
const readline = require('readline/promises')
const { stdin: input, stdout: output } = require('process')
const { spawnSync } = require('child_process')

const root = __dirname
const evolutionDir = path.join(root, 'evolution')
const envPath = path.join(evolutionDir, '.env')
const composePath = path.join(evolutionDir, 'docker-compose.yml')
const composeBaseArgs = ['compose', '-p', 'brokercloud-evolution', '--env-file', envPath, '-f', composePath]

const requiredEnv = [
  'EVOLUTION_PORT',
  'EVOLUTION_PUBLIC_URL',
  'EVOLUTION_CLIENT_NAME',
  'EVOLUTION_GLOBAL_API_KEY',
  'EVOLUTION_DB_PORT',
  'EVOLUTION_DB_USER',
  'EVOLUTION_DB_PASSWORD',
  'EVOLUTION_AUTH_DB',
  'EVOLUTION_USERS_DB',
  'DATABASE_SAVE_MESSAGES',
  'CONNECT_ON_STARTUP',
  'WEBHOOKFILES',
  'WADEBUG',
  'LOGTYPE',
]

function generateSecret(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url')
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

function formatEnvValue(value) {
  const stringValue = String(value ?? '')
  if (!stringValue) return ''
  if (/[\s#"'`$\\]/.test(stringValue)) return JSON.stringify(stringValue)
  return stringValue
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

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
}

function fail(message) {
  console.error(`\nInstalacao da Evolution bloqueada: ${message}`)
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

function getPortChecks(env = {}) {
  return [
    {
      service: 'evolution-go',
      host: '0.0.0.0',
      port: Number(env.EVOLUTION_PORT || 8080),
      allowedContainers: ['brokercloud_evolution_go'],
    },
    {
      service: 'evolution-postgres',
      host: '127.0.0.1',
      port: Number(env.EVOLUTION_DB_PORT || 55433),
      allowedContainers: ['brokercloud_evolution_db'],
    },
  ]
}

async function scanPorts(env = readEnv(envPath) || {}, options = {}) {
  const { block = true } = options
  console.log('\nScan de portas da Evolution')
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
      console.log(`- ${check.service}: ${check.host}:${check.port} ocupado pela propria Evolution (${owners.map((owner) => owner.name).join(', ')})`)
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

function checkRequired(env, fileLabel, keys) {
  const missing = keys.filter((key) => !env[key])
  if (missing.length) {
    fail(`${fileLabel} sem variaveis obrigatorias: ${missing.join(', ')}`)
  }
}

async function setupEnv() {
  const rl = readline.createInterface({ input, output })
  const existing = readEnv(envPath) || {}

  try {
    console.log('\nSetup da Evolution Go')
    console.log('Isso vai criar/atualizar evolution/.env. Aceite os defaults apertando Enter quando fizer sentido.\n')

    await scanPorts(existing, { block: false })
    console.log('')

    if (fs.existsSync(envPath)) {
      const overwrite = await confirm(rl, 'evolution/.env ja existe. Atualizar mantendo valores atuais como default?', true)
      if (!overwrite) fail('setup cancelado pelo usuario')
    }

    const publicUrl = await askRequired(rl, 'URL publica da Evolution (ex: https://zap.seudominio.com.br)', existing.EVOLUTION_PUBLIC_URL || 'https://zap.seudominio.com.br')
    const port = await askPort(rl, 'Porta externa da Evolution (EVOLUTION_PORT)', existing.EVOLUTION_PORT || '8080')

    const dbPort = await askPort(rl, 'Porta local do Postgres da Evolution (EVOLUTION_DB_PORT)', existing.EVOLUTION_DB_PORT || '55433')
    const dbUser = await askRequired(rl, 'EVOLUTION_DB_USER', existing.EVOLUTION_DB_USER || 'postgres')
    const dbPassword = await askRequired(rl, 'EVOLUTION_DB_PASSWORD', existing.EVOLUTION_DB_PASSWORD || generateSecret(24))
    const authDb = await askRequired(rl, 'EVOLUTION_AUTH_DB', existing.EVOLUTION_AUTH_DB || 'evogo_auth')
    const usersDb = await askRequired(rl, 'EVOLUTION_USERS_DB', existing.EVOLUTION_USERS_DB || 'evogo_users')

    const clientName = await askRequired(rl, 'EVOLUTION_CLIENT_NAME', existing.EVOLUTION_CLIENT_NAME || 'evolution')
    const apiKey = await askRequired(rl, 'EVOLUTION_GLOBAL_API_KEY', existing.EVOLUTION_GLOBAL_API_KEY || generateSecret(32))

    const values = {
      EVOLUTION_PORT: port,
      EVOLUTION_PUBLIC_URL: publicUrl,
      EVOLUTION_CLIENT_NAME: clientName,
      EVOLUTION_GLOBAL_API_KEY: apiKey,
      EVOLUTION_DB_PORT: dbPort,
      EVOLUTION_DB_USER: dbUser,
      EVOLUTION_DB_PASSWORD: dbPassword,
      EVOLUTION_AUTH_DB: authDb,
      EVOLUTION_USERS_DB: usersDb,
      DATABASE_SAVE_MESSAGES: existing.DATABASE_SAVE_MESSAGES || 'false',
      CONNECT_ON_STARTUP: existing.CONNECT_ON_STARTUP || 'true',
      WEBHOOKFILES: existing.WEBHOOKFILES || 'true',
      WADEBUG: existing.WADEBUG || 'INFO',
      LOGTYPE: existing.LOGTYPE || 'console',
    }

    writeEnv(envPath, [
      { title: 'Evolution Go', values: pick(values, ['EVOLUTION_PORT', 'EVOLUTION_PUBLIC_URL', 'EVOLUTION_CLIENT_NAME', 'EVOLUTION_GLOBAL_API_KEY']) },
      { title: 'Postgres exclusivo da Evolution Go', values: pick(values, ['EVOLUTION_DB_PORT', 'EVOLUTION_DB_USER', 'EVOLUTION_DB_PASSWORD', 'EVOLUTION_AUTH_DB', 'EVOLUTION_USERS_DB']) },
      { title: 'Runtime', values: pick(values, ['DATABASE_SAVE_MESSAGES', 'CONNECT_ON_STARTUP', 'WEBHOOKFILES', 'WADEBUG', 'LOGTYPE']) },
    ])

    console.log('\nArquivo criado/atualizado:')
    console.log(`- ${envPath}`)
    console.log('\nRodando preflight...')
    await preflight()
    printBrokerCloudHint(values)
    console.log('Setup da Evolution ok.')
  } finally {
    rl.close()
  }
}

function printBrokerCloudHint(env) {
  console.log('\nUse estes valores no setup/deploy do BrokerCloud API:')
  console.log(`- EVOLUTION_API_URL=${env.EVOLUTION_PUBLIC_URL}`)
  console.log('- EVOLUTION_API_KEY=<valor de EVOLUTION_GLOBAL_API_KEY em evolution/.env>')
}

async function preflight() {
  const env = readEnv(envPath)

  if (!env) fail('crie evolution/.env usando evolution/.env.example como base ou rode node install-evolution.js --setup')
  if (!fs.existsSync(composePath)) fail('evolution/docker-compose.yml nao encontrado')

  checkRequired(env, 'evolution/.env', requiredEnv)

  if (env.EVOLUTION_PUBLIC_URL.includes('localhost')) {
    warn('EVOLUTION_PUBLIC_URL aponta para localhost; na VPS use um dominio publico se a API BrokerCloud estiver fora da mesma maquina')
  }

  run('docker', [...composeBaseArgs, 'config', '--quiet'])
  await scanPorts(env)
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
    console.log('Preflight da Evolution ok.')
    return
  }

  if (args.has('--pull-only')) {
    run('docker', [...composeBaseArgs, 'pull'])
    return
  }

  const composeArgs = [...composeBaseArgs, 'up', '-d']
  if (!args.has('--no-pull')) run('docker', [...composeBaseArgs, 'pull'])

  run('docker', composeArgs)
  run('docker', [...composeBaseArgs, 'ps'])
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
