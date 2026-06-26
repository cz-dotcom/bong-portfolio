import { useCallback, useRef, useState } from 'react'
import { copyToClipboard } from '../lib/copyToClipboard'

export function useCopyFeedback(duration = 2000) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text)
      if (!ok) return false

      if (timerRef.current) window.clearTimeout(timerRef.current)
      setCopied(true)
      timerRef.current = window.setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, duration)

      return true
    },
    [duration],
  )

  return { copied, copy }
}
