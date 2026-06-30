type LoadingOverlayProps = {
  label?: string
  className?: string
}

export default function LoadingOverlay({
  label = '加载中…',
  className = '',
}: LoadingOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#070707] ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner" aria-hidden />
      <p className="text-xs text-mist/50">{label}</p>
    </div>
  )
}
