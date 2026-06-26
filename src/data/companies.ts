import { asset } from '../lib/asset'

export type CompanyLogo = {
  name: string
  shortName: string
  logo: string
  logoClass?: string
}

export const WORKED_AT_COMPANIES: CompanyLogo[] = [
  {
    name: '明源云',
    shortName: '明源云',
    logo: asset('images/logos/mingyuan.svg'),
    logoClass: 'h-[18px] sm:h-5 max-w-[5rem]',
  },
  {
    name: '红星美凯龙',
    shortName: '红星美凯龙',
    logo: asset('images/logos/easyhome.png'),
    logoClass: 'h-5 sm:h-6 max-w-[6.5rem]',
  },
  {
    name: '京东',
    shortName: '京东',
    logo: asset('images/logos/jd.svg'),
    logoClass: 'h-5 sm:h-6 max-w-[4.5rem]',
  },
  {
    name: '北京翠鸟智擎科技有限公司',
    shortName: '翠鸟智擎',
    logo: asset('images/logos/kingfisher.png'),
    logoClass: 'h-5 sm:h-[22px] max-w-[7.5rem]',
  },
]
