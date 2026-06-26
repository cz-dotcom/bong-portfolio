import { useEffect, useRef, useState } from 'react'
import {
  MARQUEE_ITEMS,
  MARQUEE_VIDEO_PLAYBACK_RATE,
  type MarqueeItem,
} from '../../data/profile'

const ROW1 = MARQUEE_ITEMS.slice(0, 11)
const ROW2 = MARQUEE_ITEMS.slice(11)
const GAP_PX = 12 // gap-3
const COLS = 4

const CARD_STYLE = (cardWidth: number) =>
  ({
    width: cardWidth,
    aspectRatio: '420 / 270',
  }) as const

function cardWidthForViewport(viewportWidth: number) {
  return Math.max(260, (viewportWidth - GAP_PX * (COLS - 1)) / COLS)
}

function MarqueeCaption({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2.5 pt-10 sm:px-4 sm:pb-3 sm:pt-12">
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
  playbackRate,
  caption,
  preload = 'metadata',
}: {
  src: string
  poster?: string
  cardWidth: number
  playbackRate: number
  caption?: string
  preload?: 'auto' | 'metadata' | 'none'
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.playbackRate = playbackRate
    void video.play().catch(() => {})
  }, [playbackRate, src])

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl bg-[#111]"
      style={CARD_STYLE(cardWidth)}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload={preload}
        className="h-full w-full object-contain"
      />
      {caption ? <MarqueeCaption text={caption} /> : null}
    </div>
  )
}

function MarqueeCard({
  item,
  cardWidth,
  active,
}: {
  item: MarqueeItem
  cardWidth: number
  active: boolean
}) {
  if (item.video) {
    return (
      <MarqueeVideo
        src={item.video}
        poster={item.image}
        cardWidth={cardWidth}
        playbackRate={MARQUEE_VIDEO_PLAYBACK_RATE}
        caption={item.caption}
        preload={item.videoPreload ?? 'metadata'}
      />
    )
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl"
      style={CARD_STYLE(cardWidth)}
    >
      <img
        src={active ? item.image : undefined}
        alt={item.caption ?? ''}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      {item.caption ? <MarqueeCaption text={item.caption} /> : null}
    </div>
  )
}

function MarqueeRow({
  items,
  translateX,
  cardWidth,
  active,
  reverseItems = false,
}: {
  items: MarqueeItem[]
  translateX: number
  cardWidth: number
  active: boolean
  reverseItems?: boolean
}) {
  const ordered = reverseItems ? [...items].reverse() : items
  const tripled = [...ordered, ...ordered, ...ordered]

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(${translateX}px)`,
          willChange: 'transform',
        }}
      >
        {tripled.map((item, i) => (
            <MarqueeCard
              key={`${item.image}-${i}`}
              item={item}
              cardWidth={cardWidth}
              active={active}
            />
          ))}
      </div>
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const [active, setActive] = useState(false)
  const [cardWidth, setCardWidth] = useState(() =>
    cardWidthForViewport(typeof window !== 'undefined' ? window.innerWidth : 1440),
  )

  useEffect(() => {
    const onResize = () => setCardWidth(cardWidthForViewport(window.innerWidth))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const sectionTop = el.getBoundingClientRect().top + window.scrollY
      const value =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(value)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const translateX = Math.max(0, offset - 200)

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-x-clip bg-dark pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow
          items={ROW1}
          translateX={translateX}
          cardWidth={cardWidth}
          active={active}
        />
        <MarqueeRow
          items={ROW2}
          translateX={translateX}
          cardWidth={cardWidth}
          active={active}
          reverseItems
        />
      </div>
    </section>
  )
}
