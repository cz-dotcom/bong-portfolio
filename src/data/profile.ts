import { asset } from '../lib/asset'

export const PORTRAIT_URL = asset('images/portrait-bong.webp')

const MARQUEE_MEDIA_NAMES = [
  'hero-aethera-preview-DknSlcTa.webp',
  'hero-asme-preview-B_nGDnTP.webp',
  'hero-celestia-preview-0yO3jXO8.webp',
  'hero-codenest-preview-Cgppc2qV.webp',
  'hero-designpro-preview-D8c5_een.webp',
  'hero-evr-ventures-preview-DZxeVFEX.webp',
  'hero-luminex-preview-CxOP7ce6.webp',
  'hero-new-era-preview-CocuDUm9.webp',
  'hero-nexora-preview-cx5HmUgo.webp',
  'hero-orbit-web3-preview-BXt4OttD.webp',
  'hero-planet-orbit-preview-DWAP8Z1P.webp',
  'hero-skyelite-preview-DHaZIgUv.webp',
  'hero-space-voyage-preview-eECLH3Yc.webp',
  'hero-stellar-ai-preview-D3HL6bw1.webp',
  'hero-stellar-ai-v2-preview-DjvxjG3C.webp',
  'hero-terra-preview-BFjrCr7T.webp',
  'hero-transform-data-preview-Cx5OU29N.webp',
  'hero-vex-ventures-preview-BczMFIiw.webp',
  'hero-vitara-preview-Cjz2QYyU.webp',
  'hero-wealth-preview-B70idl_u.webp',
  'hero-xportfolio-preview-D4A8maiC.webp',
] as const

export const MARQUEE_IMAGES = MARQUEE_MEDIA_NAMES.map((name) =>
  asset(`images/marquee/${name}`),
)

/** Marquee 每张图的图例说明，与 MARQUEE_IMAGES 顺序一一对应 */
export const MARQUEE_CAPTIONS: string[] = [
  '工地监管可视化',
  '仓储物流案例',
  '影视场景模仿',
  '物业运营管理',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
]

const MARQUEE_VIDEO_FILES: Partial<
  Record<number, { file: string; preload?: 'auto' | 'metadata' | 'none' }>
> = {
  0: { file: 'images/marquee/bong-marquee-intro.mp4', preload: 'auto' },
  1: { file: 'images/marquee/bong-marquee-logistics.mp4', preload: 'metadata' },
  2: { file: 'images/marquee/bong-marquee-film-scene.mp4', preload: 'metadata' },
  3: { file: 'images/marquee/bong-marquee-property.mp4', preload: 'metadata' },
}

export type MarqueeItem = {
  image: string
  caption?: string
  video?: string
  videoPreload?: 'auto' | 'metadata' | 'none'
}

export const MARQUEE_ITEMS: MarqueeItem[] = MARQUEE_IMAGES.map((image, index) => {
  const videoConfig = MARQUEE_VIDEO_FILES[index]
  return {
    image,
    caption: MARQUEE_CAPTIONS[index] || undefined,
    ...(videoConfig
      ? {
          video: asset(videoConfig.file),
          videoPreload: videoConfig.preload ?? 'metadata',
        }
      : {}),
  }
})

export const MARQUEE_VIDEO_PLAYBACK_RATE = 1

export const DECOR_IMAGES = {
  moon: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  object: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  lego: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  group: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
}

export const profile = {
  displayName: 'bong',
  fullName: '陈泽邦',
  title: '互联网软件项目经理',
  heroTagline: 'Professional Software\nProject Manager',
  aboutText:
    'With more than eight years of experience in project management, I focus on SaaS, CRM, ERP, and building digital visualization. I truly enjoy working with teams that aim to stand out and deliver exceptional results. Let\'s build something incredible together!',
  aboutTextZh:
    '拥有 8 年以上互联网软件项目管理经验，\n深耕地产CRM、ERP、智慧楼宇及三维可视化领域。\n持有 PMP 认证，擅长 KA 大客户统筹与跨团队敏捷交付。\n期待与你共创下一个精彩项目！',
  contact: {
    email: '498671303@qq.com',
    phone: '15625902355',
    wechat: 'czbyyds07',
    location: '深圳 · 广州 · 佛山',
  },
  services: [
    {
      number: '01',
      name: '全链路项目管控',
      description:
        '覆盖需求调研、方案设计、开发实施到上线运维，以 PMP 体系化方法保障交付质量与节点可控。',
    },
    {
      number: '02',
      name: 'KA 大客户交付',
      description:
        '多年服务头部客户，擅长复杂利益相关方管理、高层汇报与商务技术双线沟通。',
    },
    {
      number: '03',
      name: '数字化可视化',
      description:
        '具备 UE5、Unity、Ventuz 等可视化技术项目经验，能精准对接技术团队推进 3D 与数据大屏交付。',
    },
    {
      number: '04',
      name: 'AI 赋能提效',
      description:
        '熟练运用 Gemini、Cursor、Claude 等 AI 工具，在需求分析、文档撰写、风险预判中显著提升效率。',
    },
    {
      number: '05',
      name: '敏捷协作落地',
      description:
        '精通 TAPD 敏捷管理，结合 Axure、Visio、XMind 等工具，推动团队高效迭代与透明协作。',
    },
  ],
  showcaseProjects: [
    {
      number: '01',
      name: '中海总部大厦可视化',
      category: 'Client',
      images: {
        col1Top: asset('images/project-zhonghai-hq.jpg'),
        col1Bottom: asset('images/project-zhonghai-hq.jpg'),
        col2: asset('images/project-zhonghai-hq.jpg'),
      },
      link: '#projects',
    },
    {
      number: '02',
      name: '中海楼宇工程数字化',
      category: 'Client',
      images: {
        col1Top: asset('images/project-zhonghai-building.svg'),
        col1Bottom: asset('images/project-zhonghai-hq.jpg'),
        col2: asset('images/project-zhonghai-building.svg'),
      },
      link: '#projects',
    },
    {
      number: '03',
      name: 'SaaS CRM 平台项目群',
      category: 'Enterprise',
      images: {
        col1Top: asset('images/project-saas-crm.svg'),
        col1Bottom: asset('images/project-ka.svg'),
        col2: asset('images/project-saas-crm.svg'),
      },
      link: '#projects',
    },
  ],
}
