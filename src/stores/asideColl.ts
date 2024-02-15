import { defineStore } from 'pinia'

export const asideCollStore = defineStore('asideCollStore', {
  // other options
  state: () => {
    return {
      isCollapse: true
    }
  },
  actions: {
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
})
