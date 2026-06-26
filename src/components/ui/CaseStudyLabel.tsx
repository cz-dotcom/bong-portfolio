import { CURRENT_COMPANY } from '../../data/companies'

type CaseStudyLabelProps = {
  className?: string
}

export default function CaseStudyLabel({ className = '' }: CaseStudyLabelProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="text-[9px] uppercase tracking-[0.18em] text-mist/35 sm:text-xs">
        Case Study from
      </span>
      <img
        src={CURRENT_COMPANY.logo}
        alt={CURRENT_COMPANY.shortName}
        className={`h-[14px] w-auto object-contain opacity-55 sm:h-5 ${CURRENT_COMPANY.logoClass ?? ''}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
