import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import FadeIn from '../ui/FadeIn'
import Web3dSceneViewer from '../ui/Web3dSceneViewer'
import {
  PROJECT_CASES,
  PROJECT_STATS,
  TIMELINE_PROJECTS,
} from '../../data/projects'

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = PROJECT_CASES[activeIndex]
  const progress = useMemo(
    () => `${((activeIndex + 1) / PROJECT_CASES.length) * 100}%`,
    [activeIndex],
  )

  const goToProject = (index: number) => {
    setActiveIndex((index + PROJECT_CASES.length) % PROJECT_CASES.length)
  }

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 overflow-x-clip rounded-t-[40px] bg-dark px-3 pb-12 pt-0 sm:-mt-12 sm:rounded-t-[50px] sm:px-5 sm:pb-16 md:-mt-14 md:rounded-t-[60px] md:px-6 md:pb-20"
    >
      <div className="mx-auto w-full max-w-[1500px] overflow-hidden rounded-[34px] border border-mist/15 bg-[#0b0b0b] px-5 py-8 shadow-[0_28px_110px_rgba(0,0,0,0.38)] sm:rounded-[44px] sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-14">
        <FadeIn y={40} onMount>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 152px)' }}
          >
            Project
          </h2>
        </FadeIn>

        <FadeIn delay={0.08} y={24} onMount>
          <div className="mx-auto mt-4 flex max-w-3xl flex-col items-center gap-4 text-center sm:mt-5">
            <span className="h-1 w-16 rounded-full bg-gradient-to-r from-[#5227FF] via-[#FF9FFC] to-[#B497CF]" />
            <p className="text-sm font-light tracking-[0.14em] text-mist/55 sm:text-base">
              互联网软件项目经理&nbsp;&nbsp;|&nbsp;&nbsp;陈泽邦 CHEN ZEBANG
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-8 w-full min-w-0 max-w-[1400px] sm:mt-10 md:mt-12">
          <FadeIn delay={0.12} y={34} onMount>
            <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-mist/15 bg-[#0f0f0f] shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[34px]">
              <div className="projects-feature-grid grid w-full min-w-0 grid-cols-1">
                <div className="relative min-h-[250px] min-w-0 overflow-hidden bg-[#070707] sm:min-h-[340px] lg:min-h-[520px] lg:border-r lg:border-mist/10">
                  {activeProject.sceneId ? (
                    <Web3dSceneViewer
                      key={activeProject.sceneId}
                      sceneId={activeProject.sceneId}
                      fallbackImage={activeProject.image}
                      demoNotice={activeProject.sceneDemoNotice}
                      className="absolute inset-0"
                    />
                  ) : (
                    <>
                      <img
                        key={activeProject.image}
                        src={activeProject.image}
                        alt={activeProject.title}
                        className="block h-full w-full max-w-full object-cover object-center transition-opacity duration-300"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-dark/30 via-transparent to-dark/20" />
                    </>
                  )}
                </div>

                <div className="flex min-w-0 flex-col justify-center gap-6 p-6 sm:p-8 md:p-10 lg:p-12">
                  <div>
                    <p className="mb-4 text-sm font-medium text-[#C084FC]">Featured Case</p>
                    <h3 className="text-[1.75rem] font-bold leading-tight text-mist sm:text-4xl lg:text-[2.75rem]">
                      {activeProject.title}
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#A855F7]/70 bg-[#A855F7]/10 px-4 py-1.5 text-xs tracking-wide text-[#E9D5FF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-sm font-light leading-7 text-mist/65 sm:text-[15px] sm:leading-8">
                      {activeProject.summary}
                    </p>
                  </div>

                  <div className="grid gap-6 border-y border-mist/10 py-6 sm:grid-cols-2 sm:gap-8">
                    <div>
                      <p className="mb-4 text-sm font-medium text-[#C084FC]">我的角色与职责</p>
                      <ul className="space-y-4">
                        {activeProject.responsibilities.map((item) => {
                          const RoleIcon = item.icon

                          return (
                            <li key={item.text} className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#A855F7]/12 text-[#C084FC]">
                                <RoleIcon size={16} strokeWidth={1.8} />
                              </span>
                              <span className="pt-1 text-sm leading-6 text-mist/80">
                                {item.text}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="sm:border-l sm:border-mist/10 sm:pl-8">
                      <p className="mb-4 text-sm font-medium text-[#C084FC]">项目成果</p>
                      <ul className="space-y-4">
                        {activeProject.outcomes.map((outcome) => (
                          <li key={outcome.label} className="flex gap-3">
                            <ShieldCheck
                              className="mt-0.5 shrink-0 text-[#C084FC]"
                              size={20}
                              strokeWidth={1.7}
                            />
                            <div>
                              <p className="text-base font-semibold text-mist">{outcome.label}</p>
                              <p className="mt-0.5 text-xs leading-5 text-mist/45">
                                {outcome.detail}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5 sm:px-8 sm:py-6">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    aria-label="查看上一个项目"
                    onClick={() => goToProject(activeIndex - 1)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mist/15 text-mist/70 transition hover:border-mist/30 hover:bg-mist/5 hover:text-mist sm:h-11 sm:w-11"
                  >
                    <ChevronLeft size={18} strokeWidth={1.8} />
                  </button>

                  <div className="mx-auto flex w-full max-w-md min-w-0 items-center gap-4">
                    <span className="shrink-0 text-sm font-medium tracking-[0.08em] text-mist sm:text-base">
                      {String(activeIndex + 1).padStart(2, '0')}{' '}
                      <span className="text-mist/40">/ 04</span>
                    </span>
                    <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-mist/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#5227FF] via-[#FF9FFC] to-[#B497CF] transition-all duration-300"
                        style={{ width: progress }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="查看下一个项目"
                    onClick={() => goToProject(activeIndex + 1)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mist/15 text-mist/70 transition hover:border-mist/30 hover:bg-mist/5 hover:text-mist sm:h-11 sm:w-11"
                  >
                    <ChevronRight size={18} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.16} y={28} onMount>
            <div className="mt-4 grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PROJECT_CASES.map((project, index) => {
                const isActive = index === activeIndex
                const ProjectIcon = project.icon

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => goToProject(index)}
                    className={`group flex min-h-[86px] items-center gap-3.5 rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-[#A855F7] bg-[#A855F7]/10 shadow-[0_0_28px_rgba(168,85,247,0.22)]'
                        : 'border-mist/10 bg-[#111]/60 hover:border-mist/25 hover:bg-[#141414]'
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        isActive
                          ? 'bg-[#A855F7]/20 text-[#D8B4FE]'
                          : 'bg-[#A855F7]/10 text-[#C084FC]/80'
                      }`}
                    >
                      <ProjectIcon size={20} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs tracking-[0.16em] text-mist/45">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-1 block text-sm font-medium leading-snug text-mist sm:text-[15px]">
                        {project.title}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} y={34} onMount>
            <div className="mt-16 w-full min-w-0 sm:mt-20">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-mist sm:text-3xl">项目交付历程</h3>
                <span className="mt-3 block h-1 w-10 rounded-full bg-gradient-to-r from-[#5227FF] to-[#FF9FFC]" />
              </div>

              <div className="relative w-full min-w-0 border-l border-mist/15 pl-8 sm:pl-10">
                {TIMELINE_PROJECTS.map((project) => {
                  const isActive = project.id === activeProject.id
                  const TimelineIcon = project.icon
                  const carouselIndex = PROJECT_CASES.findIndex((item) => item.id === project.id)

                  return (
                    <article
                      key={project.id}
                      className="projects-timeline-row relative grid w-full min-w-0 grid-cols-1 gap-5 border-t border-mist/10 py-8 first:border-t-0 md:items-start md:gap-8"
                    >
                      <span
                        className={`absolute -left-[37px] top-9 h-3.5 w-3.5 rounded-full border-2 sm:-left-[41px] sm:top-10 sm:h-4 sm:w-4 ${
                          isActive
                            ? 'border-[#FF9FFC] bg-[#A855F7] shadow-[0_0_20px_rgba(255,159,252,0.5)]'
                            : 'border-mist/45 bg-dark'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => goToProject(carouselIndex)}
                        className="min-w-0 text-left"
                      >
                        <p
                          className={`text-3xl font-black leading-none sm:text-4xl lg:text-5xl ${
                            isActive
                              ? 'bg-gradient-to-r from-[#C084FC] to-[#FF9FFC] bg-clip-text text-transparent'
                              : 'text-mist/75'
                          }`}
                        >
                          {project.timelineYears}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => goToProject(carouselIndex)}
                        className="flex min-w-0 gap-4 text-left"
                      >
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                            isActive
                              ? 'border-[#A855F7]/50 bg-[#A855F7]/15 text-[#D8B4FE]'
                              : 'border-[#A855F7]/30 bg-[#A855F7]/8 text-[#C084FC]'
                          }`}
                        >
                          <TimelineIcon size={22} strokeWidth={1.7} />
                        </span>
                        <div>
                          <h4
                            className={`text-lg font-medium leading-snug sm:text-xl ${
                              isActive ? 'text-mist' : 'text-mist/80'
                            }`}
                          >
                            {project.title}
                          </h4>
                          <p className="mt-1.5 text-sm text-mist/50">{project.category}</p>
                        </div>
                      </button>

                      <ul className="min-w-0 space-y-2 text-sm leading-6 text-mist/55">
                        {project.timelineBullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2.5">
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#FF9FFC]/70" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.24} y={24} onMount>
            <div className="mt-12 grid w-full min-w-0 overflow-hidden rounded-[24px] border border-mist/10 bg-[#101010] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
              {PROJECT_STATS.map((stat, index) => {
                const StatIcon = stat.icon

                return (
                  <div
                    key={stat.value}
                    className={`flex items-center gap-4 px-6 py-7 ${
                      index < PROJECT_STATS.length - 1 ? 'border-b border-mist/10 lg:border-b-0' : ''
                    } ${index % 2 === 0 ? 'sm:border-r sm:border-mist/10' : ''} ${
                      index < 3 ? 'lg:border-r lg:border-mist/10' : ''
                    }`}
                  >
                    <StatIcon
                      className="shrink-0 text-[#C084FC]"
                      size={36}
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-3xl font-black leading-none text-mist sm:text-[2rem]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm font-medium text-mist/80">{stat.label}</p>
                      <p className="mt-1 text-xs leading-5 text-mist/45">{stat.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
