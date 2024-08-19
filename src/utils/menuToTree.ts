import _ from 'lodash'

export function toMenuTreeItem(item: MenuItem): MenuTreeItem {
  return { ...item, children: [] }
}

export function toSelectorType(item: MenuItem): SelectorType {
  return { label: item.name!, value: item.id!, children: [] }
}

export function toDeptTreeItem(item: MenuItem): DeptTreeItem {
  return {
    id: item.id,
    name: item.name,
    available: item.available,
    parent_id: item.parent_id ?? undefined,
    description: item.description ?? '',
    children: []
  }
}

export function menuToTree<T>(menuItems: MenuItem[], transformer: (item: MenuItem) => T): T[] {
  const menuMap = new Map<number, T>()
  const rootItems: T[] = []

  menuItems.forEach((item) => {
    if (item.id !== null && item.id !== undefined) {
      menuMap.set(item.id, transformer(item))
    }
  })

  menuItems.forEach((item) => {
    const parentId = item.parent_id
    if (parentId === null) {
      rootItems.push(menuMap.get(item.id!)!)
    } else {
      const parent = menuMap.get(parentId!)
      if (parent && (parent as any).children) {
        ;(parent as any).children.push(menuMap.get(item.id!)!)
      }
    }
  })

  return _.cloneDeep(rootItems)
}
