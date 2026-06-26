import { useEffect, useRef, useState } from 'react'
import { SITE_SECTIONS } from '../../data/nav'
import { useActiveSection } from '../../hooks/useActiveSection'

function MenuIcon({ open, light = false }: { open: boolean; light?: boolean }) {
  const line = light ? 'bg-dark/85' : 'bg-mist/90'
  return (
    <span className="relative block h-3.5 w-4">
      <span
        className={`absolute left-0 h-[1.5px] w-full rounded-full transition-all duration-200 ${line} ${
          open ? 'top-[6px] rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute left-0 top-[6px] h-[1.5px] w-full rounded-full transition-all duration-200 ${line} ${
          open ? 'scale-x-0 opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 h-[1.5px] w-full rounded-full transition-all duration-200 ${line} ${
          open ? 'top-[6px] -rotate-45' : 'top-[12px]'
        }`}
      />
    </span>
  )
}

export default function SiteNav() {
  const { activeId, activeSection } = useActiveSection()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const onLightSection = activeId === 'services'

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const shellClass = onLightSection
    ? 'border-black/10 bg-white/92 text-dark shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
    : 'border-white/10 bg-[#1a1a1a]/90 text-mist shadow-[0_8px_32px_rgba(0,0,0,0.35)]'

  const menuShellClass = onLightSection
    ? 'border-black/10 bg-white/96 text-dark shadow-[0_16px_48px_rgba(0,0,0,0.12)]'
    : 'border-white/10 bg-[#141414]/95 text-mist shadow-[0_16px_48px_rgba(0,0,0,0.45)]'

  return (
    <div
      ref={rootRef}
      className="fixed left-4 top-4 z-[100] flex items-start gap-2 sm:left-6 sm:top-6"
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 ${shellClass}`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              onLightSection
                ? 'border-black/10 bg-black/5'
                : 'border-white/15 bg-white/10'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                onLightSection ? 'bg-dark/80' : 'bg-mist/90'
              }`}
            />
          </span>
          <span
            className={`text-sm font-medium tracking-wide sm:text-[15px] ${
              onLightSection ? 'text-dark/85' : 'text-mist/90'
            }`}
          >
            {activeSection.label}
          </span>
        </div>

        <button
          type="button"
          aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`flex h-[42px] w-[42px] items-center justify-center rounded-2xl border backdrop-blur-md transition-colors sm:h-[46px] sm:w-[46px] ${shellClass} ${
            onLightSection ? 'hover:bg-black/5' : 'hover:bg-[#242424]'
          }`}
        >
          <MenuIcon open={open} light={onLightSection} />
        </button>
      </div>

      {open && (
        <nav
          className={`absolute left-0 top-[calc(100%+10px)] min-w-[180px] overflow-hidden rounded-2xl border p-2 backdrop-blur-md ${menuShellClass}`}
          aria-label="页面导航"
        >
          <ul className="flex flex-col gap-1">
            {SITE_SECTIONS.map((section) => {
              const isActive = section.id === activeId

              return (
                <li key={section.id}>
                  <a
                    href={section.href}
                    onClick={() => {
                      setOpen(false)
                      window.setTimeout(() => {
                        window.dispatchEvent(new Event('scroll'))
                      }, 350)
                    }}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? onLightSection
                          ? 'bg-black/8 text-dark'
                          : 'bg-white/10 text-mist'
                        : onLightSection
                          ? 'text-dark/60 hover:bg-black/5 hover:text-dark'
                          : 'text-mist/65 hover:bg-white/5 hover:text-mist'
                    }`}
                  >
                    <span>{section.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF9FFC]" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
