import { useEffect, useState } from 'react'
import PortraitElectricOutline from './PortraitElectricOutline'

type HeroPortraitProps = {
  src: string
  alt: string
  className?: string
}

export default function HeroPortrait({ src, alt, className }: HeroPortraitProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    if (img.complete) {
      setLoaded(true)
      return
    }
    const onLoad = () => setLoaded(true)
    img.addEventListener('load', onLoad)
    return () => img.removeEventListener('load', onLoad)
  }, [src])

  return (
    <div className={`relative ${className ?? 'hero-portrait'}`}>
      <img
        src={src}
        alt={alt}
        width={574}
        height={1024}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`relative z-10 block w-full select-none object-contain object-bottom transition-opacity duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {loaded && (
        <PortraitElectricOutline
          imageSrc={src}
          color="#FF9FFC"
          speed={1}
          chaos={0.12}
          thickness={2}
        />
      )}
    </div>
  )
}
