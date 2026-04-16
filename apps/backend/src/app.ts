import Fastify from 'fastify'
import cors from '@fastify/cors'

import { config } from './config/index.js'
import { errorHandler } from './middlewares/error-handler.js'
import { setupResponseHelpers } from './shared/schemas/response.schema.js'
import healthModule from './modules/health/index.js'

export async function buildApp(opts?: { logger?: boolean }) {
  const app = Fastify({
    logger: opts?.logger ?? config.NODE_ENV === 'development',
    trustProxy: true,
  })

  // 1. 安全 & 跨域
  await app.register(cors, { origin: true, credentials: true })

  // 2. 响应装饰器
  setupResponseHelpers(app)

  // 3. 错误处理
  app.setErrorHandler(errorHandler)

  // 4. 业务模块（health 仅用于验证架构可行性，后续会替换为 auth + system）
  await app.register(healthModule, { prefix: config.API_PREFIX })

  return app
}
