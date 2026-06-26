import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import LiveProjectButton from '../ui/LiveProjectButton'
import ContactFooter from './ContactFooter'
import { profile } from '../../data/profile'

type ProjectCardProps = {
  index: number
  total: number
  project: (typeof profile.showcaseProjects)[number]
}

function ProjectCard({ index, total, project }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div
      ref={containerRef}
      className="relative h-[85vh]"
      style={{ top: `${index * 28}px` }}
    >
      <motion.article
        style={{ scale }}
        className="sticky top-24 rounded-[40px] border-2 border-mist bg-dark p-4 sm:top-32 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 md:mb-8">
          <div className="flex flex-wrap items-end gap-4 md:gap-8">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}
            >
              {project.number}
            </span>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-mist/60">
                {project.category}
              </p>
              <h3
                className="font-medium uppercase text-mist"
                style={{ fontSize: 'clamp(1.2rem, 3vw, 2.5rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.link} />
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <img
              src={project.images.col1Top}
              alt=""
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.images.col1Bottom}
              alt=""
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <img
            src={project.images.col2}
            alt={project.name}
            className="w-[60%] rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
          />
        </div>
      </motion.article>
    </div>
  )
}

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
        {profile.showcaseProjects.map((project, index) => (
          <ProjectCard
            key={project.number}
            index={index}
            total={profile.showcaseProjects.length}
            project={project}
          />
        ))}
      </div>

      <ContactFooter />
    </section>
  )
}
