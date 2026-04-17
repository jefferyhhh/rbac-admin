import 'dotenv/config'
import { Value } from '@sinclair/typebox/value'
import { EnvSchema } from './schema.js'

const raw = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
  API_PREFIX: process.env.API_PREFIX,
  DATABASE_URL: process.env.DATABASE_URL,
}

export const config = Value.Decode(EnvSchema, raw)

// 启动时校验
if (!Value.Check(EnvSchema, config)) {
  const errors = [...Value.Errors(EnvSchema, config)]
  console.error('❌ Invalid environment variables:')
  for (const e of errors) {
    console.error(`   ${e.path}: ${e.message}`)
  }
  process.exit(1)
}
