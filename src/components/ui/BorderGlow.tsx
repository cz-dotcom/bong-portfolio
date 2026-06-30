import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'

type BorderGlowProps = {
  children?: ReactNode
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
  style?: CSSProperties
}

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  }
}

function buildBoxShadow(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ]

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100)
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`
    })
    .join(', ')
}

function easeOutCubic(x: number) {
  return 1 - (1 - x) ** 3
}

function easeInCubic(x: number) {
  return x * x * x
}

type AnimateOpts = {
  start?: number
  end?: number
  duration?: number
  delay?: number
  ease?: (t: number) => number
  onUpdate: (v: number) => void
  onEnd?: () => void
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts) {
  const t0 = performance.now() + delay

  function tick() {
    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) requestAnimationFrame(tick)
    else onEnd?.()
  }

  globalThis.setTimeout(() => requestAnimationFrame(tick), delay)
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
]
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildMeshGradients(colors: string[]) {
  const gradients: string[] = []
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`,
    )
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`)
  return gradients
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
  style = {},
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [sweepActive, setSweepActive] = useState(false)

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2] as const
  }, [])

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      let kx = Infinity
      let ky = Infinity
      if (dx !== 0) kx = cx / Math.abs(dx)
      if (dy !== 0) ky = cy / Math.abs(dy)
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    },
    [getCenterOfElement],
  )

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      if (dx === 0 && dy === 0) return 0
      const radians = Math.atan2(dy, dx)
      let degrees = radians * (180 / Math.PI) + 90
      if (degrees < 0) degrees += 360
      return degrees
    },
    [getCenterOfElement],
  )

  const colorSensitivity = edgeSensitivity + 20

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const prox = getEdgeProximity(card, x, y)
      const angle = getCursorAngle(card, x, y)
      const angleDeg = `${angle.toFixed(3)}deg`

      const bOp = Math.max(
        0,
        (prox * 100 - colorSensitivity) / (100 - colorSensitivity),
      )
      const gOp = Math.max(
        0,
        (prox * 100 - edgeSensitivity) / (100 - edgeSensitivity),
      )

      card.style.setProperty('--cursor-angle', angleDeg)
      card.style.setProperty('--border-opacity', bOp.toString())
      card.style.setProperty('--glow-opacity', gOp.toString())
    },
    [getEdgeProximity, getCursorAngle, colorSensitivity, edgeSensitivity],
  )

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    const card = cardRef.current
    if (card) {
      card.style.setProperty('--border-opacity', '0')
      card.style.setProperty('--glow-opacity', '0')
    }
  }, [])

  useEffect(() => {
    if (!animated) return

    const card = cardRef.current
    if (!card) return

    const angleStart = 110
    const angleEnd = 465
    setSweepActive(true)
    card.style.setProperty('--cursor-angle', `${angleStart}deg`)

    animateValue({
      duration: 500,
      onUpdate: (v) => {
        const prox = v / 100
        const bOp = Math.max(
          0,
          (prox * 100 - colorSensitivity) / (100 - colorSensitivity),
        )
        const gOp = Math.max(
          0,
          (prox * 100 - edgeSensitivity) / (100 - edgeSensitivity),
        )
        card.style.setProperty('--border-opacity', bOp.toString())
        card.style.setProperty('--glow-opacity', gOp.toString())
      },
    })

    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        const angle = (angleEnd - angleStart) * (v / 100) + angleStart
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
      },
    })

    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        const angle = (angleEnd - angleStart) * (v / 100) + angleStart
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
      },
    })

    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => {
        const prox = v / 100
        const bOp = Math.max(
          0,
          (prox * 100 - colorSensitivity) / (100 - colorSensitivity),
        )
        const gOp = Math.max(
          0,
          (prox * 100 - edgeSensitivity) / (100 - edgeSensitivity),
        )
        card.style.setProperty('--border-opacity', bOp.toString())
        card.style.setProperty('--glow-opacity', gOp.toString())
      },
      onEnd: () => setSweepActive(false),
    })
  }, [animated, colorSensitivity, edgeSensitivity])

  const isVisible = isHovered || sweepActive
  const meshGradients = buildMeshGradients(colors)
  const borderBg = meshGradients.map((g) => `${g} border-box`)
  const fillBg = meshGradients.map((g) => `${g} padding-box`)

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className={`glass-panel relative isolate grid ${className}`}
      style={{
        background: `linear-gradient(145deg, rgba(18, 15, 23, 0.9) 0%, rgba(18, 15, 23, 0.72) 100%), ${backgroundColor}`,
        backdropFilter: 'blur(22px) saturate(135%)',
        WebkitBackdropFilter: 'blur(22px) saturate(135%)',
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow:
          'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
        '--cursor-angle': '45deg',
        '--border-opacity': '0',
        '--glow-opacity': '0',
        '--fill-opacity': fillOpacity,
        ...style,
      } as CSSProperties}
    >
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(#000000 0 100%) padding-box',
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 'var(--border-opacity, 0)',
          maskImage: `conic-gradient(from var(--cursor-angle, 45deg) at center, black, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black)`,
          WebkitMaskImage: `conic-gradient(from var(--cursor-angle, 45deg) at center, black, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black)`,
          transition: isVisible
            ? 'opacity 0.25s ease-out'
            : 'opacity 0.15s ease-in-out',
        }}
      />

      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={
          {
            border: '1px solid transparent',
            background: fillBg.join(', '),
            maskImage: [
              'linear-gradient(to bottom, black, black)',
              'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
              'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
              `conic-gradient(from var(--cursor-angle, 45deg) at center, black, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black)`,
            ].join(', '),
            WebkitMaskImage: [
              'linear-gradient(to bottom, black, black)',
              'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
              'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
              `conic-gradient(from var(--cursor-angle, 45deg) at center, black, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black)`,
            ].join(', '),
            maskComposite: 'subtract, add, add, add, add, add',
            WebkitMaskComposite:
              'source-out, source-over, source-over, source-over, source-over, source-over',
            opacity: 'calc(var(--border-opacity, 0) * var(--fill-opacity, 0.5))',
            mixBlendMode: 'soft-light',
            transition: isVisible
              ? 'opacity 0.25s ease-out'
              : 'opacity 0.15s ease-in-out',
          } as CSSProperties
        }
      />

      <span
        className="pointer-events-none absolute z-[1] rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage:
              'conic-gradient(from var(--cursor-angle, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)',
            WebkitMaskImage:
              'conic-gradient(from var(--cursor-angle, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)',
            opacity: 'var(--glow-opacity, 0)',
            mixBlendMode: 'plus-lighter',
            transition: isVisible
              ? 'opacity 0.25s ease-out'
              : 'opacity 0.15s ease-in-out',
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="relative z-[1] flex flex-col overflow-hidden rounded-[inherit]">
        {children}
      </div>
    </div>
  )
}
