import { http } from '@/utils/request'

interface captchaData {
  key: 'string'
  img_base: 'string'
}
export default {
  getCaptcha() {
    return http.post<captchaData>('/api/system/auth/captcha/get')
  }
}
