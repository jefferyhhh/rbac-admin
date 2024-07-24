import storage from 'store'

/**
 * 存储数据
 */
export const setItem = (
  key: string,
  value: string | number | boolean | object | null | undefined
): void => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value as string)
}

/**
 * 获取数据
 */
export const getItem = <T>(key: string): T | null => {
  const data = window.localStorage.getItem(key)
  if (data === null) {
    return null
  }
  try {
    return JSON.parse(data) as T
  } catch (err) {
    return data as T
  }
}

/**
 * 删除数据
 */
export const removeItem = (key: string) => {
  window.localStorage.removeItem(key)
}

/**
 * 删除所有数据
 */
export const removeAllItem = () => {
  window.localStorage.clear()
}

/**
 * 使用store库
 */
export function save_token(accessToken: string, refreshToken: string, expiresIn: number): void {
  const expirationTime = new Date().getTime() + expiresIn
  console.log(expirationTime, expiresIn)

  storage.set('Access-Token', { accessToken, expirationTime })
  storage.set('Refresh-Token', refreshToken)
}
