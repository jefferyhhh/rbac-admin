import storage from 'store'

/**
 * 存储数据
 */
export const setItem = (key: string, value: any) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/**
 * 获取数据
 */
export const getItem = (key: string) => {
  const data: any = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
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
