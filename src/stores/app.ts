import { defineStore } from 'pinia'
import { getItem, setItem } from '@/utils/storage'

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
    ],
    tagsViewList: getItem('TAGS_VIEW') || ([] as TagView[])
  }),
  actions: {
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    },
    replaceCrumb(crumbItemList: any[]) {
      this.crumbItemList = crumbItemList
    },
    //添加tags
    addTag(tag: TagView) {
      const isFind = this.tagsViewList.find((item: any) => item.path === tag.path)
      if (!isFind) {
        this.tagsViewList.push(tag)
        setItem('TAGS_VIEW', this.tagsViewList)
      }
    },

    removeTag(index: number, type: 'self' | 'other' | 'all') {
      if (type === 'self') {
        this.tagsViewList.splice(index, 1)
        setItem('TAGS_VIEW', this.tagsViewList)
      } else if (type === 'other') {
        this.tagsViewList = [this.tagsViewList[0], this.tagsViewList[index]]
      } else if (type === 'all') {
        this.tagsViewList.splice(1)
      }
    }
  }
})
