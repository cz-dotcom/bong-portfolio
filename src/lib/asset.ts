/** public 目录资源路径，兼容 GitHub Pages 子路径 base */
export function asset(path: string) {
  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
