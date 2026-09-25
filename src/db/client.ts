import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

// A pooled connection, reused across requests. This process runs
// long-lived under PM2/Docker (not on-demand serverless), so a
// module-level singleton pool is correct here — no per-request
// connect/disconnect overhead, and no risk of exhausting connections
// on cold starts.
//
// Runtime credentials are scoped to SELECT/INSERT/UPDATE on this
// database only — the app can never DROP/ALTER/DELETE its own tables
// even if compromised (see the provisioning notes for the host user,
// and docker/mysql/init/ for the containerized one).
//
// Pool creation is deferred behind getDb()/the Proxy below rather than
// run at module load: Next.js evaluates this module during its build
// step (to collect route config) with no runtime env vars present —
// eagerly connecting here would fail every production build.

declare global {
  // eslint-disable-next-line no-var
  var __lakspireDbPool: mysql.Pool | undefined
  // eslint-disable-next-line no-var
  var __lakspireDb: MySql2Database<typeof schema> | undefined
}

function createPool(): mysql.Pool {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env
  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Database environment variables are not fully configured (DB_HOST/DB_USER/DB_PASSWORD/DB_NAME).')
  }
  return mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60_000,
    enableKeepAlive: true,
  })
}

function getDb(): MySql2Database<typeof schema> {
  if (!global.__lakspireDb) {
    const pool = global.__lakspireDbPool ?? createPool()
    global.__lakspireDbPool = pool
    global.__lakspireDb = drizzle(pool, { schema, mode: 'default' })
  }
  return global.__lakspireDb
}

export const db: MySql2Database<typeof schema> = new Proxy({} as MySql2Database<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver)
  },
})
