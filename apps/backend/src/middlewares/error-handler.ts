import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { AppError } from '../shared/errors/index.js'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error)

  // 业务错误
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
      data: null,
      message: error.message,
    })
  }

  // Fastify schema 验证错误
  if (error.validation) {
    return reply.status(200).send({
      code: 400,
      data: null,
      message: error.message,
    })
  }

  // 兜底
  return reply.status(500).send({
    code: 500,
    data: null,
    message: '服务器内部错误',
  })
}
