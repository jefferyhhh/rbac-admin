const whiteList: string[] = ['/login', '/import', '/404', '/401']

/**
 * path 是否需要被缓存, 404这些界面都不需要被保存
 * @param path 要检查的路径
 * @returns 是否需要被缓存
 */
export function isTags(path: string): boolean {
  return !whiteList.includes(path)
}
