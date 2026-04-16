import type { FastifyInstance, FastifyReply } from 'fastify'

export function setupResponseHelpers(app: FastifyInstance) {
  app.decorateReply(
    'success',
    function (this: FastifyReply, data: unknown, opts?: { message?: string }) {
      return this.status(200).send({
        code: 200,
        data,
        message: opts?.message ?? 'success',
      })
    },
  )

  app.decorateReply('error', function (this: FastifyReply, message: string, code = 400) {
    return this.status(200).send({
      code,
      data: null,
      message,
    })
  })
}

declare module 'fastify' {
  interface FastifyReply {
    success(data: unknown, opts?: { message?: string }): FastifyReply
    error(message: string, code?: number): FastifyReply
  }
}
