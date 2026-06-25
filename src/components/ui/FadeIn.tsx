import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeInProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  /** 首屏等立即可见区域用 mount 动画，避免 whileInView 未触发导致透明 */
  onMount?: boolean
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  onMount = false,
  ...rest
}: FadeInProps) {
  const transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as const,
  }

  if (onMount) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, x, y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={transition}
        {...rest}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px', amount: 0.15 }}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
