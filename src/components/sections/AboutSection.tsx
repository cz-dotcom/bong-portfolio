import ContactButton from '../ui/ContactButton'
import FadeIn from '../ui/FadeIn'
import SplitText from '../ui/SplitText'
import { DECOR_IMAGES, profile } from '../../data/profile'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
        <img
          src={DECOR_IMAGES.moon}
          alt=""
          className="w-[120px] sm:w-[160px] md:w-[210px]"
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]"
      >
        <img
          src={DECOR_IMAGES.object}
          alt=""
          className="w-[100px] sm:w-[140px] md:w-[180px]"
        />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
        <img
          src={DECOR_IMAGES.lego}
          alt=""
          className="w-[120px] sm:w-[160px] md:w-[210px]"
        />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]"
      >
        <img
          src={DECOR_IMAGES.group}
          alt=""
          className="w-[130px] sm:w-[170px] md:w-[220px]"
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <SplitText
          text={profile.aboutTextZh}
          className="about-copy mx-auto max-w-[42rem] px-4 font-normal text-mist/90"
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
            lineHeight: 1.95,
            letterSpacing: '0.04em',
            whiteSpace: 'pre-line',
          }}
          delay={12}
          duration={0.45}
          ease="power2.out"
          splitType="lines, chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.15}
          rootMargin="-80px"
          textAlign="center"
        />

        <FadeIn delay={0.2} y={20} className="mt-16 sm:mt-20 md:mt-24">
          <ContactButton label="联系我" />
        </FadeIn>
      </div>
    </section>
  )
}
