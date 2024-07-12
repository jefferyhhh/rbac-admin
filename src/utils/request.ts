import axios from 'axios'
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

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

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error: AxiosError) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    // 错误抛出
    return Promise.reject(error)
  }
)

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
