import _ from 'lodash'

export function listToTree(menuItems: MenuItem[]): MenuTreeItem[] {
  const menuMap = new Map<number, MenuTreeItem>()
  const rootItems: MenuTreeItem[] = []
  menuItems.forEach((item) => {
    if (item.id !== null && item.id !== undefined) {
      menuMap.set(item.id, { ...item, children: [] })
    }
  })

  menuItems.forEach((item) => {
    const parentId = item.parent_id
    if (parentId === null) {
      const currentItem = menuMap.get(item.id!)!
      rootItems.push(currentItem)
    } else {
      const parent = menuMap.get(parentId!)
      if (parent) {
        parent.children!.push(menuMap.get(item.id!)!)
      }
    }
  })
  // 深拷贝以避免修改原始数据
  return _.cloneDeep(rootItems)
}

export function listToTree2(menuItems: MenuItem[]): SelectorType[] {
  const menuMap = new Map<number, SelectorType>()
  // 构建节点映射
  menuItems.forEach((item) => {
    menuMap.set(item.id!, { label: item.name!, value: item.id!, children: [] })
  })

  const rootItems: SelectorType[] = []
  // 构建树状结构
  menuItems.forEach((item) => {
    const currentItem = menuMap.get(item.id!)!
    if (item.parent_id === null) {
      rootItems.push(currentItem)
    } else {
      const parent = menuMap.get(item.parent_id!)
      if (parent) {
        parent.children?.push(currentItem)
      }
    }
  })
  return _.cloneDeep(rootItems)
}
