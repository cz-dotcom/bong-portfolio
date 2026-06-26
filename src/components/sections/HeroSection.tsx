import ContactButton from '../ui/ContactButton'
import CompanyLogos from '../ui/CompanyLogos'
import FadeIn from '../ui/FadeIn'
import HeroPortrait from '../ui/HeroPortrait'
import LiquidEther from '../ui/LiquidEther'
import SplitText from '../ui/SplitText'
import TextType from '../ui/TextType'
import { PORTRAIT_URL, profile } from '../../data/profile'

const HERO_TITLE = `Hi, i'm ${profile.displayName}`

const LIQUID_COLORS = ['#5227FF', '#FF9FFC', '#B497CF']

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative z-10 flex flex-col overflow-hidden bg-dark max-sm:pb-6 sm:h-screen sm:min-h-0"
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

      <FadeIn
        onMount
        delay={0.15}
        y={40}
        className="relative z-10 mt-12 w-full shrink-0 px-3 max-sm:mt-[4.75rem] sm:mt-16 sm:px-4 md:mt-[4.5rem] lg:mt-20"
      >
        <TextType
          as="h1"
          text={HERO_TITLE}
          className="hero-title relative block w-full text-center font-black uppercase"
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

      {/* 手机：人物放进文档流，避免绝对定位撑出大段空白 */}
      <FadeIn
        onMount
        delay={0.25}
        y={20}
        className="relative z-10 flex justify-center px-4 pt-1 sm:hidden"
      >
        <HeroPortrait
          src={PORTRAIT_URL}
          alt={profile.displayName}
          className="hero-portrait-mobile"
        />
      </FadeIn>

      <div className="relative z-20 mt-2 shrink-0 px-4 max-sm:mt-1 max-sm:px-2 sm:mt-auto sm:px-8 sm:pb-6 md:px-10 md:pb-8">
        <div className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-4">
          <div className="min-w-0 max-sm:w-full sm:self-end">
            <SplitText
              text={profile.heroTagline}
              tag="p"
              className="hero-tagline font-light uppercase tracking-wide text-mist"
              style={{
                fontSize: 'clamp(0.7rem, 3.2vw, 1.5rem)',
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
            <FadeIn
              onMount
              delay={0.65}
              y={12}
              className="max-sm:flex max-sm:items-end max-sm:justify-between max-sm:gap-2"
            >
              <CompanyLogos className="min-w-0 max-sm:flex-1" />
              <div className="shrink-0 sm:hidden">
                <ContactButton
                  label="联系我"
                  className="max-sm:px-5 max-sm:py-2.5 max-sm:text-[11px] max-sm:tracking-wider"
                />
              </div>
            </FadeIn>
          </div>

          <FadeIn onMount delay={0.5} y={0} className="hidden shrink-0 sm:block sm:self-end">
            <ContactButton label="联系我" />
          </FadeIn>
        </div>
      </div>

      {/* 桌面：人物绝对定位在底部 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] hidden translate-y-[6%] justify-center sm:flex">
        <HeroPortrait src={PORTRAIT_URL} alt={profile.displayName} />
      </div>
    </section>
  )
}
