import axios from 'axios'
import storage from 'store'
import router from '@/router'
import { getNewToken } from '@/api/user'
import { save_token } from '@/utils/storage'
import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})

// 异常拦截处理器
const errorHandler = async (error: AxiosError) => {
  if (!error.response) {
    return Promise.reject(error) //未接收到服务器响应，网络等原因
  }
  const errRes: AxiosResponse = error.response
  const { code, message } = errRes.data
  const access_token = storage.get('Access-Token') //获取 access_token
  if (code === 403) {
    storage.remove('Access-Token')
    storage.remove('Refresh-Token')

    ElNotification({
      title: '错误',
      message: message,
      type: 'error'
    })
    router.push('/login')
    return Promise.reject(error)
  }
  if (code === 401) {
    if (!access_token) {
      ElNotification({
        title: '错误',
        message: message,
        type: 'error'
      })
      router.push('/login')
      return Promise.reject(error)
    }
    // 刷新token
    const refresh_token = storage.get('Refresh-Token')
    storage.remove('Access-Token')
    storage.remove('Refresh-Token')
    return getNewToken({ refresh_token: refresh_token }).then((response) => {
      const { access_token, refresh_token, expires_in } = response.data
      save_token(access_token, refresh_token, expires_in)
      //重新发起刚刚错误的请求
      return service(errRes.config).then((response) => response)
    })
  }
}
// 请求拦截器
service.interceptors.request.use((config) => {
  const { accessToken } = storage.get('Access-Token') ?? { accessToken: null }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}` //携带token
  }
  return config
}, errorHandler)

// 响应拦截器
service.interceptors.response.use((response) => {
  const { code, message, data } = response.data
  if (code !== 200) {
    ElNotification({
      title: '错误',
      message: message,
      type: 'error'
    })
    console.log(message, data, 1, '错误-响应')
    return Promise.reject(response)
  }
  return response.data
}, errorHandler)

//导出封装的请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}

export default service
