import { useEffect, useRef, useState } from 'react'
import { MARQUEE_IMAGES } from '../../data/profile'

const ROW1 = MARQUEE_IMAGES.slice(0, 11)
const ROW2 = MARQUEE_IMAGES.slice(11)

function MarqueeRow({
  images,
  direction,
  offset,
}: {
  images: string[]
  direction: 'left' | 'right'
  offset: number
}) {
  const tripled = [...images, ...images, ...images]
  const translateX =
    direction === 'right' ? offset - 200 : -(offset - 200)

  return (
    <div
      className="flex gap-3"
      style={{
        transform: `translateX(${translateX}px)`,
        willChange: 'transform',
      }}
    >
      {tripled.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

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

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-x-clip bg-dark pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow images={ROW1} direction="right" offset={offset} />
        <MarqueeRow images={ROW2} direction="left" offset={offset} />
      </div>
    </section>
  )
}
