export type PathPoint = { x: number; y: number }

/** 归一化坐标 0–1，相对图片宽高 */
export type SilhouettePath = {
  points: PathPoint[]
  mode: 'silhouette' | 'circle'
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function isOpaque(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
  threshold: number,
) {
  if (x < 0 || y < 0 || x >= w || y >= h) return false
  const i = (y * w + x) * 4
  return data[i + 3] > threshold
}

function isBoundary(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
  threshold: number,
) {
  if (!isOpaque(data, w, h, x, y, threshold)) return false
  return (
    !isOpaque(data, w, h, x - 1, y, threshold) ||
    !isOpaque(data, w, h, x + 1, y, threshold) ||
    !isOpaque(data, w, h, x, y - 1, threshold) ||
    !isOpaque(data, w, h, x, y + 1, threshold)
  )
}

function traceBoundary(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  threshold: number,
): PathPoint[] {
  let sx = -1
  let sy = -1
  outer: for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isBoundary(data, w, h, x, y, threshold)) {
        sx = x
        sy = y
        break outer
      }
    }
  }
  if (sx === -1) return []

  const dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ]

  const contour: PathPoint[] = [{ x: sx, y: sy }]
  let px = sx
  let py = sy
  let backtrack = 7
  const maxSteps = w * h * 4

  for (let step = 0; step < maxSteps; step++) {
    let found = false
    const startDir = (backtrack + 1) % 8
    for (let i = 0; i < 8; i++) {
      const dir = (startDir + i) % 8
      const nx = px + dirs[dir][0]
      const ny = py + dirs[dir][1]
      if (!isBoundary(data, w, h, nx, ny, threshold)) continue

      if (nx === sx && ny === sy && contour.length > 12) {
        return simplifyPath(contour, 2)
      }

      contour.push({ x: nx, y: ny })
      backtrack = (dir + 4) % 8
      px = nx
      py = ny
      found = true
      break
    }
    if (!found) break
  }

  return simplifyPath(contour, 2)
}

function simplifyPath(points: PathPoint[], step: number): PathPoint[] {
  if (points.length <= step * 2) return points
  const out: PathPoint[] = []
  for (let i = 0; i < points.length; i += step) {
    out.push(points[i])
  }
  return out
}

function normalizePath(points: PathPoint[], w: number, h: number): PathPoint[] {
  return points.map((p) => ({ x: p.x / w, y: p.y / h }))
}

/** 上半身椭圆描边（归一化坐标，兜底方案） */
export function createCircleFallbackPath(): SilhouettePath {
  const points: PathPoint[] = []
  const cx = 0.5
  const cy = 0.34
  const rx = 0.34
  const ry = 0.24
  const segments = 128

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    points.push({
      x: cx + Math.cos(t) * rx,
      y: cy + Math.sin(t) * ry,
    })
  }

  return { points, mode: 'circle' }
}

export async function extractSilhouettePath(src: string): Promise<SilhouettePath> {
  try {
    const img = await loadImage(src)
    const maxW = 320
    const scale = maxW / img.naturalWidth
    const w = maxW
    const h = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return createCircleFallbackPath()

    ctx.drawImage(img, 0, 0, w, h)
    const { data } = ctx.getImageData(0, 0, w, h)
    const raw = traceBoundary(data, w, h, 96)

    if (raw.length < 40) return createCircleFallbackPath()

    return {
      points: normalizePath(raw, w, h),
      mode: 'silhouette',
    }
  } catch {
    return createCircleFallbackPath()
  }
}

export function getPointOnPath(points: PathPoint[], progress: number): PathPoint {
  if (points.length === 0) return { x: 0.5, y: 0.5 }
  if (points.length === 1) return points[0]

  const total = points.length
  const scaled = progress * total
  const idx = Math.floor(scaled) % total
  const next = (idx + 1) % total
  const t = scaled - Math.floor(scaled)

  return {
    x: points[idx].x + (points[next].x - points[idx].x) * t,
    y: points[idx].y + (points[next].y - points[idx].y) * t,
  }
}
