import { asset } from '../lib/asset'

export type CompanyLogo = {
  name: string
  shortName: string
  logo: string
  logoClass?: string
  /** 现任公司 */
  current?: boolean
}

export const WORKED_AT_COMPANIES: CompanyLogo[] = [
  {
    name: '明源云',
    shortName: '明源云',
    logo: asset('images/logos/mingyuan.svg'),
    logoClass: 'max-sm:max-w-[4.25rem] sm:max-w-[5rem]',
  },
  {
    name: '红星美凯龙',
    shortName: '红星美凯龙',
    logo: asset('images/logos/easyhome.png'),
    logoClass: 'max-sm:max-w-[4.25rem] sm:max-w-[6.5rem]',
  },
  {
    name: '京东',
    shortName: '京东',
    logo: asset('images/logos/jd.svg'),
    logoClass: 'max-sm:max-w-[4rem] sm:max-w-[4.5rem]',
  },
  {
    name: '北京翠鸟智擎科技有限公司',
    shortName: '翠鸟智擎',
    logo: asset('images/logos/kingfisher.png'),
    logoClass: 'max-sm:max-w-[4.25rem] sm:max-w-[7.5rem]',
    current: true,
  },
]

export const CURRENT_COMPANY =
  WORKED_AT_COMPANIES.find((company) => company.current) ??
  WORKED_AT_COMPANIES[WORKED_AT_COMPANIES.length - 1]

export const PAST_COMPANIES = WORKED_AT_COMPANIES.filter((company) => !company.current)
