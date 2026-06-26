import { useEffect, useState } from 'react'
import { SITE_SECTIONS, type SiteSectionId } from '../data/nav'

const DEFAULT_SECTION: SiteSectionId = SITE_SECTIONS[0].id

function getSectionBounds(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const top = rect.top + window.scrollY
  return { top, bottom: top + rect.height }
}

function getVisibleHeight(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  return Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))
}

function resolveActiveSection(): SiteSectionId {
  const vh = window.innerHeight
  const hash = window.location.hash.replace('#', '') as SiteSectionId

  if (SITE_SECTIONS.some((section) => section.id === hash)) {
    const hashEl = document.getElementById(hash)
    if (hashEl && getVisibleHeight(hashEl) > vh * 0.15) {
      return hash
    }
  }

  const probeY = window.scrollY + vh * 0.32

  for (let i = SITE_SECTIONS.length - 1; i >= 0; i--) {
    const section = SITE_SECTIONS[i]
    const el = document.getElementById(section.id)
    if (!el) continue

    const { top, bottom } = getSectionBounds(el)
    if (probeY >= top && probeY < bottom) {
      return section.id
    }
  }

  let fallback: SiteSectionId = DEFAULT_SECTION
  for (const section of SITE_SECTIONS) {
    const el = document.getElementById(section.id)
    if (!el) continue
    const { top } = getSectionBounds(el)
    if (probeY >= top) {
      fallback = section.id
    }
  }

  return fallback
}

export function useActiveSection() {
  const [activeId, setActiveId] = useState<SiteSectionId>(DEFAULT_SECTION)

  useEffect(() => {
    const update = () => {
      const nextId = resolveActiveSection()
      setActiveId(nextId)

      const nextHash = `#${nextId}`
      if (window.location.hash !== nextHash) {
        history.replaceState(null, '', nextHash)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('hashchange', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('hashchange', update)
    }
  }, [])

  const activeSection =
    SITE_SECTIONS.find((section) => section.id === activeId) ?? SITE_SECTIONS[0]

  return { activeId, activeSection }
}
