// import axios from 'axios'
// import { ElMessage } from 'element-plus'

// interface option {
//   method: string
//   data: any
//   params: any
//   url: string
// }

// const NETWORKERR = '网路请求异常，请稍后再试！'
// const service = axios.create({
//   baseURL: import.meta.env.VITE_BASE_API
// })

// // 请求拦截器——请求之前
// service.interceptors.request.use((req) => {
//   return req
// })

// // 响应拦截器——请求之后
// service.interceptors.response.use((res) => {
//   const { code, msg, data } = res.data
//   if (code == 200) {
//     return data
//   } else {
//     ElMessage.error(msg || NETWORKERR)
//     return Promise.reject(msg || NETWORKERR)
//   }
// })

// //封装
// function rerquest(options: option) {
//   options.method = options.method || 'get'
//   if (options.method.toLowerCase() === 'get') {
//     options.params = options.data
//   }
//   service(options)
// }
// export default rerquest

import axios from 'axios'

export interface RequestOptions {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  params?: object
  data?: object
}

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    // 请求前处理config
    return config
  },
  (error) => {
    // 错误抛出
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    // 数据返回后处理
    return response
  },
  (error) => {
    // 错误抛出
    return Promise.reject(error)
  }
)

export default service

// core request function
export function request(options: RequestOptions) {
  return service(options)
}

// GET
export function get<T>(url: string, params?: object) {
  return request({
    method: 'get',
    url,
    params
  }) as Promise<T>
}

// POST
export function post<T>(url: string, data?: object) {
  return request({
    method: 'post',
    url,
    data
  }) as Promise<T>
}

// PUT
export function put<T>(url: string, data?: object) {
  return request({
    method: 'put',
    url,
    data
  }) as Promise<T>
}

// DELETE
export function del<T>(url: string) {
  return request({
    method: 'delete',
    url
  }) as Promise<T>
}
