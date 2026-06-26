import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createCircleFallbackPath,
  extractSilhouettePath,
  getPointOnPath,
  type SilhouettePath,
} from '../../lib/silhouettePath'

type PortraitElectricOutlineProps = {
  imageSrc: string
  color?: string
  speed?: number
  chaos?: number
  thickness?: number
}

export default function PortraitElectricOutline({
  imageSrc,
  color = '#FF9FFC',
  speed = 1,
  chaos = 0.12,
  thickness = 2,
}: PortraitElectricOutlineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SilhouettePath>(createCircleFallbackPath())
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const lastFrameTimeRef = useRef(0)
  const [ready, setReady] = useState(false)

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1
  }, [])

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x)
      const j = Math.floor(y)
      const fx = x - i
      const fy = y - j
      const a = random(i + j * 57)
      const b = random(i + 1 + j * 57)
      const c = random(i + (j + 1) * 57)
      const d = random(i + 1 + (j + 1) * 57)
      const ux = fx * fx * (3.0 - 2.0 * fx)
      const uy = fy * fy * (3.0 - 2.0 * fy)
      return (
        a * (1 - ux) * (1 - uy) +
        b * ux * (1 - uy) +
        c * (1 - ux) * uy +
        d * ux * uy
      )
    },
    [random],
  )

  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number,
    ): number => {
      let y = 0
      let amplitude = baseAmplitude
      let frequency = baseFrequency
      for (let i = 0; i < octaves; i++) {
        y += amplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3)
        frequency *= lacunarity
        amplitude *= gain
      }
      return y
    },
    [noise2D],
  )

  useEffect(() => {
    let cancelled = false
    extractSilhouettePath(imageSrc).then((path) => {
      if (cancelled) return
      pathRef.current = path
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [imageSrc])

  useEffect(() => {
    if (!ready) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = 28
    const displacement = pathRef.current.mode === 'silhouette' ? 18 : 14

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width + padding * 2
      const height = rect.height + padding * 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      return { width, height, dpr }
    }

    let { width, height, dpr } = updateSize()

    const draw = (currentTime: number) => {
      if (!canvas || !ctx) return

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000
      timeRef.current += deltaTime * speed
      lastFrameTimeRef.current = currentTime

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      const drawW = width - padding * 2
      const drawH = height - padding * 2
      const points = pathRef.current.points
      const sampleCount = Math.max(points.length * 2, 160)

      ctx.strokeStyle = color
      ctx.lineWidth = thickness
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = color
      ctx.shadowBlur = 8

      ctx.beginPath()
      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount
        const p = getPointOnPath(points, progress)
        const x = padding + p.x * drawW
        const y = padding + p.y * drawH

        const xNoise = octavedNoise(progress * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 0)
        const yNoise = octavedNoise(progress * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 1)

        const px = x + xNoise * displacement
        const py = y + yNoise * displacement

        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()

      animationRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => {
      ;({ width, height, dpr } = updateSize())
    })
    ro.observe(container)

    lastFrameTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      ro.disconnect()
    }
  }, [ready, chaos, color, octavedNoise, speed, thickness])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}
