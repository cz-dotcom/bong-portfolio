import { WORKED_AT_COMPANIES } from '../../data/companies'

type CompanyLogosProps = {
  className?: string
}

export default function CompanyLogos({ className = '' }: CompanyLogosProps) {
  return (
    <div className={`mt-2 max-sm:mt-2.5 sm:mt-4 ${className}`}>
      <p className="mb-2 text-left text-[9px] uppercase tracking-[0.18em] text-mist/35 sm:text-xs">
        曾任职
      </p>
      <ul className="flex flex-nowrap items-end justify-start gap-x-2 gap-y-0 sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
        {WORKED_AT_COMPANIES.map((company) => (
          <li key={company.name} title={company.name} className="shrink-0">
            <img
              src={company.logo}
              alt={company.name}
              className={`w-auto object-contain opacity-55 transition-opacity duration-200 hover:opacity-95 max-sm:h-[14px] max-sm:max-w-[4.25rem] ${company.logoClass ?? 'h-4 sm:h-5'}`}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
