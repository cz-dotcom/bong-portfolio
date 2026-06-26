type WeChatIconProps = {
  className?: string
}

export default function WeChatIcon({ className = 'h-4 w-4' }: WeChatIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8.5 3C4.91 3 2 5.46 2 8.58c0 1.75.93 3.31 2.38 4.34L3.5 15.5l2.97-1.48c.78.22 1.61.34 2.47.34.22 0 .44-.01.65-.03C8.95 16.89 9 17.73 9 18.58 9 21.7 11.91 24 15.5 24c.86 0 1.69-.12 2.47-.34l2.97 1.48-1.88-2.58C20.07 21.89 21 20.33 21 18.58 21 15.46 18.09 13 14.5 13c-.17 0-.34.01-.5.03C13.34 7.84 11.38 3 8.5 3zm-2 5.25a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm5.5 4.75a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  )
}
