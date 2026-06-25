import FadeIn from '../ui/FadeIn'
import { profile } from '../../data/profile'

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2
        className="mb-16 text-center font-black uppercase text-dark sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </h2>

      <div className="mx-auto max-w-5xl">
        {profile.services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <article
              className="flex flex-col gap-4 border-t border-dark/15 py-8 sm:flex-row sm:items-start sm:gap-8 sm:py-10 md:py-12"
            >
              <span
                className="shrink-0 font-black text-dark"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}
              >
                {service.number}
              </span>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-medium uppercase text-dark"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-dark/60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
        <div className="border-t border-dark/15" />
      </div>
    </section>
  )
}
