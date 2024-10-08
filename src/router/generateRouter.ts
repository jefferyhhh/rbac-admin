import type { RouteRecordSingleViewWithChildren } from 'vue-router'

const modules = import.meta.glob('../views/**/**.vue')

export const generator = (routers: MenuTreeItem[]) => {
  return routers.map((item) => {
    const currentRouter: RouteRecordSingleViewWithChildren = {
      path: item.route_path!,
      name: item.route_name,
      component: item.component_path ? modules[`../views/${item.component_path}.vue`] : null,
      redirect: item.redirect ?? undefined,
      children: [],
      meta: {
        title: item.name,
        icon: item.icon || undefined,
        keepAlive: item.cache,
        hidden: item.hidden,
        order: item.order
      }
    }
    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children)
    }
    return currentRouter
  })
}
