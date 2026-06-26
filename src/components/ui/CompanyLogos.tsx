import { CURRENT_COMPANY, PAST_COMPANIES, type CompanyLogo } from '../../data/companies'

type CompanyLogosProps = {
  className?: string
}

const LOGO_HEIGHT_CLASS = 'h-[14px] sm:h-5'

function LogoImg({ company, dimmed = true }: { company: CompanyLogo; dimmed?: boolean }) {
  return (
    <img
      src={company.logo}
      alt={company.name}
      className={`${LOGO_HEIGHT_CLASS} w-auto object-contain transition-opacity duration-200 hover:opacity-95 ${company.logoClass ?? 'max-w-[5rem]'} ${
        dimmed ? 'opacity-55' : 'opacity-90'
      }`}
      loading="lazy"
      decoding="async"
    />
  )
}

export default function CompanyLogos({ className = '' }: CompanyLogosProps) {
  return (
    <div className={`mt-2 max-sm:mt-2.5 sm:mt-4 ${className}`}>
      <p className="mb-2 text-left text-[9px] uppercase tracking-[0.18em] text-mist/35 sm:text-xs">
        任职经历
      </p>
      <ul className="flex flex-nowrap items-center justify-start gap-x-2 gap-y-0 sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
        {PAST_COMPANIES.map((company) => (
          <li key={company.name} title={company.name} className="flex shrink-0 items-center">
            <LogoImg company={company} />
          </li>
        ))}
        <li key={CURRENT_COMPANY.name} title={CURRENT_COMPANY.name} className="flex shrink-0 items-center">
          <LogoImg company={CURRENT_COMPANY} dimmed={false} />
        </li>
      </ul>
    </div>
  )
}
