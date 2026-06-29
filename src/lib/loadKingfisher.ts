import { asset } from './asset'

let loaderPromise: Promise<void> | null = null

function injectScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-kf-src="${src}"]`)
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.charset = 'utf-8'
    script.dataset.kfSrc = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

/** 动态加载翠鸟 Kingfisher 运行时（仅需加载一次） */
export function loadKingfisherRuntime() {
  if (window.Kingfisher) {
    return Promise.resolve()
  }

  if (!loaderPromise) {
    loaderPromise = (async () => {
      await injectScript(asset('static/kingfisher.core.js'))
      await injectScript(asset('static/kingfisher.js'))
    })().catch((error) => {
      loaderPromise = null
      throw error
    })
  }

  return loaderPromise
}
