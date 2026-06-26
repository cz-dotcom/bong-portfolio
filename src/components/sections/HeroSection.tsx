import ContactButton from '../ui/ContactButton'
import CompanyLogos from '../ui/CompanyLogos'
import FadeIn from '../ui/FadeIn'
import HeroPortrait from '../ui/HeroPortrait'
import LiquidEther from '../ui/LiquidEther'
import SplitText from '../ui/SplitText'
import TextType from '../ui/TextType'
import { PORTRAIT_URL, profile } from '../../data/profile'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const HERO_TITLE = `Hi, i'm ${profile.displayName}`

const LIQUID_COLORS = ['#5227FF', '#FF9FFC', '#B497CF']

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative z-10 flex h-screen flex-col overflow-hidden bg-dark"
    >
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={LIQUID_COLORS}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          className="h-full w-full"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[#0c0c0c]/65"
        aria-hidden
      />

      <nav className="relative z-20">
        <FadeIn onMount delay={0} y={-20}>
          <ul className="flex items-center justify-start gap-6 px-6 pt-6 sm:gap-8 md:px-10 md:pt-8 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium uppercase tracking-wider text-mist transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </nav>

      <FadeIn
        onMount
        delay={0.15}
        y={40}
        className="relative z-10 mt-6 w-full px-4 sm:mt-8 md:mt-10 lg:mt-12"
      >
        <TextType
          as="h1"
          text={HERO_TITLE}
          className="hero-title relative block w-full whitespace-nowrap text-center font-black uppercase"
          textClassName="hero-heading"
          typingSpeed={75}
          initialDelay={300}
          pauseDuration={1500}
          deletingSpeed={50}
          loop={false}
          showCursor
          cursorCharacter="_"
          cursorClassName="hero-heading"
          cursorBlinkDuration={0.5}
        />
      </FadeIn>

      <div className="relative z-20 mt-auto px-6 pb-7 sm:px-8 sm:pb-8 md:px-10 md:pb-10">
        <div className="relative z-20 grid w-full grid-cols-[1fr_auto] items-end gap-4">
          <div className="min-w-0 self-end">
            <SplitText
              text={profile.heroTagline}
              tag="p"
              className="hero-tagline font-light uppercase tracking-wide text-mist"
              style={{
                fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)',
                lineHeight: 1.35,
                whiteSpace: 'pre-line',
              }}
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="lines, chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
              immediate
            />
            <FadeIn onMount delay={0.65} y={12}>
              <CompanyLogos />
            </FadeIn>
          </div>

          <FadeIn onMount delay={0.5} y={0} className="shrink-0 self-end">
            <ContactButton label="联系我" />
          </FadeIn>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-[6%] justify-center">
        <HeroPortrait src={PORTRAIT_URL} alt={profile.displayName} />
      </div>
    </section>
  )
}
