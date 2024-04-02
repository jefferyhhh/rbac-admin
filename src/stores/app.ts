import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isCollapse: true,
    crumbItemList: [
      {
        to: {
          path: '/'
        },
        name: '首页'
      }
    ]
  }),
  actions: {
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    },
    replaceCrumb(crumbItemList: any[]) {
      this.crumbItemList = crumbItemList
    }
  }
})
