import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

const { Pool } = pg

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  // 启动时测一次连接
  try {
    await prisma.$connect()
    fastify.log.info('✅ Prisma (PostgreSQL) connected')
  } catch (err) {
    fastify.log.error('❌ Prisma connection failed:', err)
    throw err
  }

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
    await pool.end()
    fastify.log.info('Prisma disconnected, pool closed')
  })
}

export default fp(prismaPlugin, {
  name: 'prisma',
})
