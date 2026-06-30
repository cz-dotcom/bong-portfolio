import { useEffect, type RefObject } from 'react'

export type PerformanceProfile = 'default' | 'mobile' | 'wechat'

export function isWeChatBrowser() {
  if (typeof navigator === 'undefined') return false
  return /MicroMessenger/i.test(navigator.userAgent)
}

export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 640 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  )
}

export function getPerformanceProfile(): PerformanceProfile {
  if (isWeChatBrowser()) return 'wechat'
  if (isMobileDevice()) return 'mobile'
  return 'default'
}

/** 微信 X5 内核：内联 H5 播放，避免切原生全屏播放器 */
export function applyWeChatVideoAttrs(video: HTMLVideoElement) {
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('x5-playsinline', 'true')
  video.setAttribute('x5-video-player-type', 'h5')
  video.setAttribute('x5-video-player-fullscreen', 'false')
}

export function useWeChatVideoAttrs(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    if (!isWeChatBrowser()) return
    const video = ref.current
    if (video) applyWeChatVideoAttrs(video)
  })
}

export function getWeb3dRenderLimits(profile: PerformanceProfile) {
  switch (profile) {
    case 'wechat':
      return { limitWidth: 854, limitHeight: 480 }
    case 'mobile':
      return { limitWidth: 1024, limitHeight: 576 }
    default:
      return { limitWidth: 1280, limitHeight: 720 }
  }
}

export function scheduleNonBlocking(task: () => void, timeoutMs = 800) {
  if ('requestIdleCallback' in globalThis) {
    globalThis.requestIdleCallback(task, { timeout: timeoutMs })
  } else {
    globalThis.setTimeout(task, 300)
  }
}
