import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

type MagnetProps = {
  children: ReactNode
  className?: string
  padding?: number
  strength?: number
  /** 限制磁吸最大位移（px） */
  maxOffset?: number
  /** 全屏监听鼠标，头像随光标在视口内移动 */
  global?: boolean
  activeTransition?: string
  inactiveTransition?: string
}

function clamp(value: number, max: number) {
  return Math.max(-max, Math.min(max, value))
}

export default function Magnet({
  children,
  className = '',
  padding = 150,
  strength = 3,
  maxOffset = 40,
  global = false,
  activeTransition = 'transform 0.2s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const updateFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = Math.abs(clientX - centerX)
      const distY = Math.abs(clientY - centerY)

      if (
        distX < rect.width / 2 + padding &&
        distY < rect.height / 2 + padding
      ) {
        setActive(true)
        setPosition({
          x: clamp((clientX - centerX) / strength, maxOffset),
          y: clamp((clientY - centerY) / strength, maxOffset),
        })
      } else {
        setActive(false)
        setPosition({ x: 0, y: 0 })
      }
    },
    [padding, strength, maxOffset],
  )

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateFromPoint(e.clientX, e.clientY)
    },
    [updateFromPoint],
  )

  const handleLeave = useCallback(() => {
    if (!global) {
      setActive(false)
      setPosition({ x: 0, y: 0 })
    }
  }, [global])

  useEffect(() => {
    if (!global) return

    const onMove = (e: MouseEvent) => updateFromPoint(e.clientX, e.clientY)
    const onLeave = () => {
      setActive(false)
      setPosition({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [global, updateFromPoint])

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={global ? undefined : handleMove}
      onMouseLeave={global ? undefined : handleLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
