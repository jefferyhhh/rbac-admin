import type { FastifyInstance } from 'fastify'
import { config } from './config/index.js'

export interface ServerContext {
  app: FastifyInstance
  cleanup: () => Promise<void>
}

export async function startServer(
  app: FastifyInstance,
  opts?: { host?: string; port?: number },
): Promise<ServerContext> {
  const host = opts?.host ?? config.HOST
  const port = opts?.port ?? config.PORT

  await app.listen({ host, port })
  app.log.info(`🚀 Server running at http://${host}:${port}`)
  app.log.info(`📖 API docs at http://${host}:${port}/docs`)

  const cleanup = async () => {
    app.log.info('Shutting down...')
    await app.close()
    app.log.info('Server stopped')
  }

  return { app, cleanup }
}

export function setupGracefulShutdown(ctx: ServerContext): () => void {
  const shutdown = async (signal: string) => {
    ctx.app.log.info(`Received ${signal}, starting graceful shutdown...`)
    try {
      await ctx.cleanup()
      process.exit(0)
    } catch (err) {
      ctx.app.log.fatal(err, 'Graceful shutdown failed')
      process.exit(1)
    }
  }

  const onSIGINT = () => shutdown('SIGINT')
  const onSIGTERM = () => shutdown('SIGTERM')

  process.on('SIGINT', onSIGINT)
  process.on('SIGTERM', onSIGTERM)

  return () => {
    process.off('SIGINT', onSIGINT)
    process.off('SIGTERM', onSIGTERM)
  }
}
