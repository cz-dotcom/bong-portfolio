export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-dark px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2
        className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </h2>

      <div className="mx-auto max-w-6xl">
        <article className="rounded-[40px] border-2 border-mist/20 bg-[#111] p-10 text-center sm:rounded-[50px] sm:p-14 md:rounded-[60px] md:p-20">
          <div
            className="mx-auto mb-6 h-1 w-16 rounded-full sm:mb-8"
            style={{
              background: 'linear-gradient(90deg, #5227FF, #FF9FFC, #B497CF)',
            }}
          />
          <p className="text-2xl font-medium tracking-wide text-mist sm:text-3xl md:text-4xl">
            此模块开发中
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.2em] text-mist/45 sm:text-base">
            Under Development
          </p>
        </article>
      </div>
    </section>
  )
}
