import { motion, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef } from 'react'

type AnimatedTextProps = {
  text: string
  className?: string
}

export default function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  const chars = useMemo(() => text.split(''), [text])

  return (
    <p
      ref={ref}
      className={`mx-auto max-w-[560px] text-center font-medium leading-relaxed text-mist ${className}`}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {chars.map((char, i) => (
        <Char key={`${char}-${i}`} progress={scrollYProgress} index={i} total={chars.length}>
          {char === ' ' ? '\u00A0' : char}
        </Char>
      ))}
    </p>
  )
}

function Char({
  children,
  progress,
  index,
  total,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
  total: number
}) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [0.25, 1])

  return (
    <span className="relative inline-block">
      <span className="invisible">{children}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  )
}
