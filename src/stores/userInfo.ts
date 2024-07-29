import { defineStore } from 'pinia'
import { getUserInfo, type userInfoRes } from '@/api/user'

export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    basicInfo: {} as userInfoRes,
    routeList: [],
    hasGetRoute: false
  }),
  actions: {
    async getUserInfo() {
      try {
        const response = await getUserInfo()
        const result = response.data
        const routers = result.menus
        delete result.menus
        this.setRoute(routers)
        this.basicInfo = { ...this.basicInfo, ...result }
      } catch (error) {
        console.log(error)
      }
    },
    setRoute(routers: any) {
      this.routeList = routers
      this.hasGetRoute = true
    },
    // setAvatar(avatar) {
    //   this.basicInfo.avatar = avatar
    // },
    clearUserInfo() {
      this.basicInfo = {} as userInfoRes
      this.routeList = []
      this.hasGetRoute = false
    }
  }
})
