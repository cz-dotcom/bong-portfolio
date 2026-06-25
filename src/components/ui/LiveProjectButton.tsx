type LiveProjectButtonProps = {
  href?: string
  className?: string
}

export default function LiveProjectButton({
  href = '#projects',
  className = '',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full border-2 border-mist px-8 py-3 text-sm font-medium uppercase tracking-widest text-mist transition-colors hover:bg-mist/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      Live Project
    </a>
  )
}
