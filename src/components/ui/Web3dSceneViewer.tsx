import { useCallback, useEffect, useRef, useState } from 'react'
import { loadKingfisherRuntime } from '../../lib/loadKingfisher'
import type { Web3dManager } from '../../lib/web3d.js'

type Web3dSceneViewerProps = {
  sceneId: string
  className?: string
  fallbackImage?: string
  /** 示意场景保密说明（非实际项目交付内容） */
  demoNotice?: string
}

const SCENE_CONTROLS = [
  { event: '侧视图', label: '侧视图' },
  { event: '顶视图', label: '顶视图' },
  { event: '热力', label: '热力' },
  { event: '点位', label: '点位' },
] as const

export default function Web3dSceneViewer({
  sceneId,
  className = '',
  fallbackImage,
  demoNotice,
}: Web3dSceneViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const managerRef = useRef<Web3dManager | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [visible, setVisible] = useState(false)
  const [activeControl, setActiveControl] = useState<string>('侧视图')

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) {
      managerRef.current?.destroy()
      managerRef.current = null
      setStatus('idle')
      setActiveControl('侧视图')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    setStatus('loading')

    loadKingfisherRuntime()
      .then(async () => {
        if (cancelled) return

        const { Web3dManager: Manager } = await import('../../lib/web3d.js')
        const manager = new Manager(canvas, {
          sceneId: [sceneId],
          limitWidth: 1280,
          limitHeight: 720,
        }) as Web3dManager

        if (!manager.getEngine?.()) {
          throw new Error('Kingfisher engine failed to start')
        }

        manager.registerWeb3dListener({
          onLoad: () => {
            if (!cancelled) setStatus('ready')
          },
          onLoadingHide: () => {
            if (!cancelled) setStatus('ready')
          },
        })

        managerRef.current = manager
      })
      .catch((error) => {
        console.error('[Web3dSceneViewer]', error)
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      managerRef.current?.destroy()
      managerRef.current = null
    }
  }, [visible, sceneId])

  const triggerSceneEvent = useCallback((event: string) => {
    const manager = managerRef.current
    if (!manager || status !== 'ready') return

    manager.issueEvent(event)
    setActiveControl(event)
  }, [status])

  return (
    <div ref={hostRef} className={`relative h-full w-full ${className}`}>
      {fallbackImage ? (
        <img
          src={fallbackImage}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: status === 'ready' ? 0 : 1 }}
        />
      ) : null}

      {demoNotice && status !== 'error' ? (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10">
          <p className="rounded-lg border border-amber-200/15 bg-[#1a1508]/85 px-2.5 py-1.5 text-[10px] leading-relaxed text-amber-100/75 backdrop-blur-sm sm:px-3 sm:text-[11px]">
            {demoNotice}
          </p>
        </div>
      ) : null}

      {status === 'ready' ? (
        <div className="absolute bottom-3 right-3 z-20 flex flex-wrap justify-end gap-1.5 sm:gap-2">
          {SCENE_CONTROLS.map(({ event, label }) => {
            const isActive = activeControl === event

            return (
              <button
                key={event}
                type="button"
                onClick={() => triggerSceneEvent(event)}
                className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-medium backdrop-blur-sm transition sm:px-3 sm:py-2 sm:text-[11px] ${
                  isActive
                    ? 'border-[#A855F7]/70 bg-[#A855F7]/25 text-[#E9D5FF]'
                    : 'border-mist/15 bg-dark/75 text-mist/70 hover:border-mist/30 hover:bg-dark/90 hover:text-mist'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#070707]/85 text-sm text-mist/55">
          3D 场景加载中…
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#070707] px-4 text-center text-sm text-mist/55">
          3D 场景加载失败，请刷新重试
        </div>
      ) : null}

      <canvas
        ref={canvasRef}
        className="relative z-[1] block h-full w-full cursor-grab active:cursor-grabbing"
        style={{ opacity: status === 'ready' ? 1 : 0, touchAction: 'none' }}
      />
    </div>
  )
}
