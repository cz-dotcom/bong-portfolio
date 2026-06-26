import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'marquee')
const MAX_SECONDS = 25

const JOBS = [
  {
    src: String.raw`e:\9 bandicamer\bandicam 2026-06-26 10-41-43-053.mp4`,
    out: 'bong-marquee-intro-hd.mp4',
  },
  {
    src: String.raw`e:\9 bandicamer\bandicam 2026-06-26 14-05-21-457.mp4`,
    out: 'bong-marquee-logistics-hd.mp4',
  },
  {
    src: String.raw`e:\9 bandicamer\bandicam 2026-06-26 14-21-46-460.mp4`,
    out: 'bong-marquee-film-scene-hd.mp4',
  },
  {
    src: String.raw`e:\9 bandicamer\bandicam 2026-06-23 18-14-58-053.mp4`,
    out: 'bong-marquee-property-hd.mp4',
  },
]

function runFfmpeg(args) {
  execFileSync(ffmpegPath, args, { stdio: 'inherit' })
}

function getDuration(file) {
  try {
    execFileSync(ffmpegPath, ['-i', file], { stdio: ['ignore', 'pipe', 'pipe'] })
    throw new Error(`Cannot read duration: ${file}`)
  } catch (error) {
    const text = error?.stderr?.toString?.() ?? ''
    const match = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(text)
    if (!match) throw new Error(`Cannot read duration: ${file}`)
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
  }
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

mkdirSync(OUT_DIR, { recursive: true })

for (const job of JOBS) {
  if (!existsSync(job.src)) {
    console.error(`Missing source: ${job.src}`)
    process.exitCode = 1
    continue
  }

  const outPath = path.join(OUT_DIR, job.out)
  const duration = getDuration(job.src)
  const needsTrim = duration > MAX_SECONDS + 0.05

  console.log(`\n=== ${path.basename(job.src)} ===`)
  console.log(`duration: ${duration.toFixed(2)}s -> ${needsTrim ? `trim ${MAX_SECONDS}s` : 'keep as-is'}`)
  console.log(`output: ${job.out}`)

  const args = ['-y', '-i', job.src]
  if (needsTrim) {
    args.push('-t', String(MAX_SECONDS))
  }

  args.push(
    '-vf',
    'scale=1920:-2:force_original_aspect_ratio=decrease',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '23',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-an',
    outPath,
  )

  runFfmpeg(args)
  console.log(`done: ${formatMb(statSync(outPath).size)}`)
}

console.log('\nAll marquee HD videos processed.')
