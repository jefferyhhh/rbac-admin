import Fastify from 'fastify'
import cors from '@fastify/cors'

import { config } from './config/index.js'
import { errorHandler } from './middlewares/error-handler.js'
import { setupResponseHelpers } from './shared/schemas/response.schema.js'
import healthModule from './modules/health/index.js'
import prismaPlugin from './shared/plugins/postgres.js'

export async function buildApp(opts?: { logger?: boolean }) {
  const app = Fastify({
    logger: opts?.logger ?? config.NODE_ENV === 'development',
    trustProxy: true,
  })

  // 1. 安全 & 跨域
  await app.register(cors, { origin: true, credentials: true })

  // 2. 技术插件
  await app.register(prismaPlugin)

  // 3. 响应装饰器
  setupResponseHelpers(app)

  // 4. 错误处理
  app.setErrorHandler(errorHandler)

  // 5. 业务模块
  await app.register(healthModule, { prefix: config.API_PREFIX })

  return app
}
