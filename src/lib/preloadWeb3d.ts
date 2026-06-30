import { asset } from './asset'
import { loadKingfisherRuntime } from './loadKingfisher'
import { scheduleNonBlocking } from './wechatEnv'

let web3dModulePromise: Promise<typeof import('./web3d.js')> | null = null
const prefetchedScenes = new Set<string>()

let activePreloadId: string | null = null
let activePreloadPromise: Promise<void> | null = null

export function preloadWeb3dModule() {
  if (!web3dModulePromise) {
    web3dModulePromise = import('./web3d.js')
  }
  return web3dModulePromise
}

export function prefetchSceneManifest(sceneId: string) {
  if (prefetchedScenes.has(sceneId)) return
  prefetchedScenes.add(sceneId)

  const href = asset(`static/scenes/${sceneId}/${sceneId}.json`)
  if (document.querySelector(`link[data-scene-prefetch="${sceneId}"]`)) return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'fetch'
  link.href = href
  link.dataset.scenePrefetch = sceneId
  document.head.appendChild(link)
}

/**
 * 后台预加载：翠鸟运行时 + web3d 管理器 + 场景 JSON。
 * 不创建 canvas / WebGL，可在用户滚动到 Projects 之前提前执行。
 */
export function preloadWeb3dScene(sceneId: string) {
  if (activePreloadId === sceneId && activePreloadPromise) {
    return activePreloadPromise
  }

  activePreloadId = sceneId
  activePreloadPromise = Promise.all([
    loadKingfisherRuntime(),
    preloadWeb3dModule(),
  ])
    .then(() => {
      prefetchSceneManifest(sceneId)
    })
    .catch((error) => {
      activePreloadPromise = null
      activePreloadId = null
      throw error
    })

  return activePreloadPromise
}

export function preloadWeb3dSceneIdle(sceneId: string, timeoutMs = 1200) {
  scheduleNonBlocking(() => {
    void preloadWeb3dScene(sceneId)
  }, timeoutMs)
}
