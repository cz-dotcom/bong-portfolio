import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { MARQUEE_VIDEO_PLAYBACK_RATE } from '../../data/profile'

export type MarqueeVideoModalItem = {
  src: string
  caption?: string
}

type MarqueeVideoModalProps = {
  item: MarqueeVideoModalItem | null
  onClose: () => void
}

export default function MarqueeVideoModal({ item, onClose }: MarqueeVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const open = Boolean(item)

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    const video = videoRef.current
    if (!open || !video || !item) return

    video.playbackRate = MARQUEE_VIDEO_PLAYBACK_RATE
    video.currentTime = 0
    void video.play().catch(() => {})

    return () => {
      video.pause()
    }
  }, [open, item])

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="marquee-video-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-label="关闭"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-mist/15 bg-[#111] shadow-2xl sm:rounded-3xl"
            style={{
              boxShadow:
                '0 24px 80px rgba(118, 33, 176, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="h-1.5 w-full"
              style={{
                background: 'linear-gradient(90deg, #5227FF, #FF9FFC, #B497CF, #BE4C00)',
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1.5 text-mist/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-mist sm:right-4 sm:top-4"
              aria-label="关闭视频"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-3 sm:p-4">
              {item.caption ? (
                <h2
                  id="marquee-video-title"
                  className="mb-3 px-1 text-sm font-medium text-mist sm:text-base"
                >
                  {item.caption}
                </h2>
              ) : (
                <h2 id="marquee-video-title" className="sr-only">
                  案例视频
                </h2>
              )}

              <div className="overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  key={item.src}
                  src={item.src}
                  className="marquee-video aspect-video w-full bg-black object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
