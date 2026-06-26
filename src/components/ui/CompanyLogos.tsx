import { WORKED_AT_COMPANIES } from '../../data/companies'

export default function CompanyLogos() {
  return (
    <div className="mt-4 sm:mt-5">
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-mist/35 sm:text-xs">
        曾任职
      </p>
      <ul className="flex flex-wrap items-end gap-x-4 gap-y-2 sm:gap-x-5">
        {WORKED_AT_COMPANIES.map((company) => (
          <li key={company.name} title={company.name}>
            <img
              src={company.logo}
              alt={company.name}
              className={`w-auto object-contain opacity-55 transition-opacity duration-200 hover:opacity-95 ${company.logoClass ?? 'h-5'}`}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
