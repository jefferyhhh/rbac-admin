import type { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { AppError } from '../../shared/errors/index.js'

export default async function healthModule(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: Type.Object({
            code: Type.Number(),
            data: Type.Object({
              status: Type.String(),
              timestamp: Type.String(),
            }),
            message: Type.String(),
          }),
        },
      },
    },
    async (_request, reply) => {
      return reply.success({ status: 'ok', timestamp: new Date().toISOString() })
    },
  )

  // 故意一个错误路由，验证 errorHandler 是否生效
  app.get('/error', async (_request, _reply) => {
    throw new AppError(400, '这是一个测试错误')
  })
}
