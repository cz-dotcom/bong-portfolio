const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js'
const UMAMI_WEBSITE_ID = '228b45ca-1cf8-4a93-896a-89fb32387b3d'

/** 生产环境延迟加载 Umami，本地开发不计入访问统计 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return
  if (document.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`)) return

  const load = () => {
    const script = document.createElement('script')
    script.defer = true
    script.src = UMAMI_SCRIPT
    script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
    document.head.appendChild(script)
  }

  const scheduleLoad = () => {
    if ('requestIdleCallback' in globalThis) {
      globalThis.requestIdleCallback(load, { timeout: 3000 })
    } else {
      globalThis.setTimeout(load, 1500)
    }
  }

  scheduleLoad()
}
