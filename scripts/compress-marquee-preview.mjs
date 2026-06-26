import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(path.resolve(__dirname, '..'), 'public', 'images', 'marquee')

const PREVIEWS = [
  'bong-marquee-intro.mp4',
  'bong-marquee-logistics.mp4',
  'bong-marquee-film-scene.mp4',
  'bong-marquee-property.mp4',
]

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

for (const file of PREVIEWS) {
  const input = path.join(OUT_DIR, file)
  const output = path.join(OUT_DIR, file.replace('.mp4', '-lite.mp4'))

  if (!existsSync(input)) {
    console.error(`Missing: ${input}`)
    process.exitCode = 1
    continue
  }

  console.log(`\n=== ${file} -> ${path.basename(output)} ===`)
  console.log(`input: ${formatMb(statSync(input).size)}`)

  execFileSync(
    ffmpegPath,
    [
      '-y',
      '-i',
      input,
      '-vf',
      'scale=720:-2:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '28',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      output,
    ],
    { stdio: 'inherit' },
  )

  console.log(`output: ${formatMb(statSync(output).size)}`)
}

console.log('\nPreview lite videos ready.')
