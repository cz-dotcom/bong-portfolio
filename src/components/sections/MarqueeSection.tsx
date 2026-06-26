import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  MARQUEE_ITEMS,
  MARQUEE_VIDEO_PLAYBACK_RATE,
  type MarqueeItem,
} from '../../data/profile'
import MarqueeVideoModal, {
  type MarqueeVideoModalItem,
} from '../ui/MarqueeVideoModal'

/** 仅展示 4 个视频案例，避免多余解码与带宽占用 */
const ROW_ITEMS = MARQUEE_ITEMS.slice(0, 4)
const GAP_PX = 12 // gap-3
const COLS = 4
const MOBILE_SIDE_PADDING = 32 // px-4 * 2

function cardWidthForViewport(viewportWidth: number) {
  if (viewportWidth < 640) {
    return viewportWidth - MOBILE_SIDE_PADDING
  }
  return Math.max(260, (viewportWidth - GAP_PX * (COLS - 1)) / COLS)
}

function cardAspectRatio(isMobile: boolean) {
  return isMobile ? '16 / 9' : '420 / 270'
}

function marqueeItemKey(item: MarqueeItem, index: number) {
  return `${item.video ?? item.image ?? 'card'}-${index}`
}

function useCardInView(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setInView(false)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2, 0.45] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled])

  return inView
}

function MarqueeCaption({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2.5 pt-10 sm:px-4 sm:pb-3 sm:pt-12">
      <p className="text-[11px] font-medium leading-snug text-mist sm:text-xs md:text-sm">
        {text}
      </p>
    </div>
  )
}

function MarqueeVideo({
  src,
  poster,
  cardWidth,
  isMobile,
  playbackRate,
  caption,
  preload = 'none',
  shouldPlay,
  playDelay = 0,
  onOpen,
}: {
  src: string
  poster?: string
  cardWidth: number
  isMobile: boolean
  playbackRate: number
  caption?: string
  preload?: 'auto' | 'metadata' | 'none'
  shouldPlay: boolean
  playDelay?: number
  onOpen: () => void
}) {
  const containerRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const loadedSrcRef = useRef<string | null>(null)
  const inView = useCardInView(containerRef, shouldPlay)
  const [ready, setReady] = useState(false)
  const shouldLoad = shouldPlay && inView

  useEffect(() => {
    setReady(false)
  }, [src, shouldLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!shouldLoad) {
      video.pause()
      if (loadedSrcRef.current) {
        video.removeAttribute('src')
        video.load()
        loadedSrcRef.current = null
      }
      return
    }

    if (loadedSrcRef.current !== src) {
      video.src = src
      loadedSrcRef.current = src
      video.load()
    }

    const onReady = () => setReady(true)
    video.addEventListener('loadeddata', onReady)
    if (video.readyState >= 2) setReady(true)

    return () => video.removeEventListener('loadeddata', onReady)
  }, [src, shouldLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return

    let timer = 0

    video.playbackRate = playbackRate
    timer = window.setTimeout(() => {
      void video.play().catch(() => {})
    }, playDelay)

    return () => window.clearTimeout(timer)
  }, [shouldLoad, playbackRate, playDelay, src])

  return (
    <button
      type="button"
      ref={containerRef}
      onClick={onOpen}
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#111] text-left transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9FFC]"
      style={{
        width: cardWidth,
        aspectRatio: cardAspectRatio(isMobile),
      }}
      aria-label={caption ? `放大播放：${caption}` : '放大播放案例视频'}
    >
      {poster && !ready ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          className={`absolute inset-0 z-0 h-full w-full ${
            isMobile ? 'object-contain' : 'object-cover'
          }`}
        />
      ) : null}
      {!ready && !poster ? (
        <div className="absolute inset-0 z-0 animate-pulse bg-[#161616]" aria-hidden />
      ) : null}
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={false}
        loop
        muted
        playsInline
        preload={preload}
        disablePictureInPicture
        className={`marquee-video pointer-events-none relative z-[1] h-full w-full ${
          isMobile ? 'object-contain' : 'object-cover'
        } ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-black/0 transition-colors group-hover:bg-black/20"
        aria-hidden
      />
      {caption ? <MarqueeCaption text={caption} /> : null}
    </button>
  )
}

function MarqueeCard({
  item,
  cardWidth,
  isMobile,
  previewActive,
  videoIndex,
  onVideoOpen,
}: {
  item: MarqueeItem
  cardWidth: number
  isMobile: boolean
  previewActive: boolean
  videoIndex: number
  onVideoOpen: (item: MarqueeVideoModalItem) => void
}) {
  if (item.video) {
    return (
      <MarqueeVideo
        src={item.video}
        poster={item.image}
        cardWidth={cardWidth}
        isMobile={isMobile}
        playbackRate={MARQUEE_VIDEO_PLAYBACK_RATE}
        caption={item.caption}
        preload={item.videoPreload ?? 'none'}
        shouldPlay={previewActive}
        playDelay={videoIndex * 120}
        onOpen={() =>
          onVideoOpen({
            src: item.videoHd ?? item.video!,
            caption: item.caption,
          })
        }
      />
    )
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl bg-[#111]"
      style={{
        width: cardWidth,
        aspectRatio: cardAspectRatio(isMobile),
      }}
    >
      <img
        src={previewActive ? item.image : undefined}
        alt={item.caption ?? ''}
        loading="lazy"
        decoding="async"
        className={`h-full w-full ${isMobile ? 'object-contain' : 'object-cover'}`}
      />
      {item.caption ? <MarqueeCaption text={item.caption} /> : null}
    </div>
  )
}

function MobileMarqueeCarousel({
  items,
  cardWidth,
  active,
  onVideoOpen,
}: {
  items: MarqueeItem[]
  cardWidth: number
  active: boolean
  onVideoOpen: (item: MarqueeVideoModalItem) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const slideStride = cardWidth + GAP_PX

  const syncIndexFromScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const nextIndex = Math.round(el.scrollLeft / slideStride)
    setIndex(Math.max(0, Math.min(nextIndex, items.length - 1)))
  }

  useEffect(() => {
    setIndex(0)
    scrollRef.current?.scrollTo({ left: 0 })
  }, [items.length, slideStride])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', syncIndexFromScroll, { passive: true })
    return () => el.removeEventListener('scroll', syncIndexFromScroll)
  }, [items.length, slideStride])

  const scrollToIndex = (targetIndex: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: targetIndex * slideStride, behavior: 'smooth' })
    setIndex(targetIndex)
  }

  let videoIndex = 0

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex snap-x snap-mandatory gap-3">
          {items.map((item, i) => {
            const currentVideoIndex = item.video ? videoIndex++ : -1

            return (
              <div key={marqueeItemKey(item, i)} className="shrink-0 snap-center">
                <MarqueeCard
                  item={item}
                  cardWidth={cardWidth}
                  isMobile
                  previewActive={active && i === index}
                  videoIndex={currentVideoIndex >= 0 ? currentVideoIndex : 0}
                  onVideoOpen={onVideoOpen}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
        {items.map((item, i) => (
          <button
            key={marqueeItemKey(item, i)}
            type="button"
            aria-label={`切换到第 ${i + 1} 个案例`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-5 bg-[#FF9FFC]' : 'w-1.5 bg-mist/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function MarqueeRow({
  items,
  parallaxOffset,
  cardWidth,
  active,
  onVideoOpen,
}: {
  items: MarqueeItem[]
  parallaxOffset: number
  cardWidth: number
  active: boolean
  onVideoOpen: (item: MarqueeVideoModalItem) => void
}) {
  let videoIndex = 0

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex gap-3"
        style={{ marginLeft: `${parallaxOffset}px` }}
      >
        {items.map((item, i) => {
          const currentVideoIndex = item.video ? videoIndex++ : -1

          return (
            <div key={marqueeItemKey(item, i)} className="shrink-0">
              <MarqueeCard
                item={item}
                cardWidth={cardWidth}
                isMobile={false}
                previewActive={active}
                videoIndex={currentVideoIndex >= 0 ? currentVideoIndex : 0}
                onVideoOpen={onVideoOpen}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const [active, setActive] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  )
  const [cardWidth, setCardWidth] = useState(() =>
    cardWidthForViewport(typeof window !== 'undefined' ? window.innerWidth : 1440),
  )
  const [modalItem, setModalItem] = useState<MarqueeVideoModalItem | null>(null)

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setCardWidth(cardWidthForViewport(width))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '80px', threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isMobile) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const sectionTop = el.getBoundingClientRect().top + window.scrollY
        const value = (window.scrollY - sectionTop + window.innerHeight) * 0.3
        setOffset(value)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isMobile])

  const parallaxOffset = Math.max(0, offset - 200)
  const previewActive = active && !modalItem

  return (
    <section
      ref={sectionRef}
      className="relative z-30 overflow-x-clip bg-dark px-4 pb-10 pt-6 sm:px-0 sm:pb-8 sm:pt-12 md:pt-16 lg:pt-20"
    >
      {isMobile ? (
        <MobileMarqueeCarousel
          items={ROW_ITEMS}
          cardWidth={cardWidth}
          active={previewActive}
          onVideoOpen={setModalItem}
        />
      ) : (
        <MarqueeRow
          items={ROW_ITEMS}
          parallaxOffset={parallaxOffset}
          cardWidth={cardWidth}
          active={previewActive}
          onVideoOpen={setModalItem}
        />
      )}
      <MarqueeVideoModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  )
}
