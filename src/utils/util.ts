import _ from 'lodash'
import type { MenuItem } from '@/api/user'

export interface MenuTreeItem extends MenuItem {
  children?: MenuTreeItem[]
}
export function listToTree(menuItems: MenuItem[]): MenuTreeItem[] {
  const menuMap = new Map<number, MenuTreeItem>()
  const rootItems: MenuTreeItem[] = []
  menuItems.forEach((item) => {
    menuMap.set(item.id, { ...item, children: [] })
  })

  menuItems.forEach((item) => {
    const parentId = item.parent_id
    if (parentId === null) {
      rootItems.push(menuMap.get(item.id)!)
    } else {
      const parent = menuMap.get(parentId)
      if (parent) {
        parent.children!.push(menuMap.get(item.id)!)
      }
    }
  })
  // 深拷贝以避免修改原始数据
  return _.cloneDeep(rootItems)
}
