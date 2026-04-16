export class AppError extends Error {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly statusCode: number = 200,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class BadRequestError extends AppError {
  constructor(message = '请求参数错误') {
    super(400, message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '请登录后再试') {
    super(401, message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '无权限操作') {
    super(403, message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = '资源不存在') {
    super(404, message, 404)
  }
}
