declare type TagView = {
  /** 页签名称 */
  name: any
  /** 页签标题 */
  title: string
  /** 页签路由路径 */
  path: string
  /** 页签路由完整路径 */
  fullPath: string
  /** 页签图标 */
  icon?: string
  /** 是否固定页签 */
  affix?: boolean
  /** 是否开启缓存 */
  keepAlive?: boolean
  /** 路由查询参数 */
  query?: any
}

/** 来自后端的菜单 */
declare type MenuItem = {
  available: boolean
  cache: boolean
  component_path: string | null
  created_at: string
  description: string | null
  hidden: boolean
  icon?: string
  id: number
  name: string
  order: number
  parent_id: number | null
  parent_name: string | null
  permission: string
  redirect: string | null
  route_name: string
  route_path: string
  type: number
  updated_at: string
}
/* util处理后的菜单 */
declare type MenuTreeItem = MenuItem & {
  children?: MenuTreeItem[]
}
