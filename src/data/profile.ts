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
  Record<
    number,
    {
      preview: string
      hd: string
      preload?: 'auto' | 'metadata' | 'none'
    }
  >
> = {
  0: {
    preview: 'images/marquee/bong-marquee-intro.mp4',
    hd: 'images/marquee/bong-marquee-intro-hd.mp4',
    preload: 'metadata',
  },
  1: {
    preview: 'images/marquee/bong-marquee-logistics.mp4',
    hd: 'images/marquee/bong-marquee-logistics-hd.mp4',
    preload: 'metadata',
  },
  2: {
    preview: 'images/marquee/bong-marquee-film-scene.mp4',
    hd: 'images/marquee/bong-marquee-film-scene-hd.mp4',
    preload: 'metadata',
  },
  3: {
    preview: 'images/marquee/bong-marquee-property.mp4',
    hd: 'images/marquee/bong-marquee-property-hd.mp4',
    preload: 'metadata',
  },
}

export type MarqueeItem = {
  /** 静态展示图（仅无视频的卡片使用） */
  image?: string
  caption?: string
  /** 卡片预览用低清循环视频 */
  video?: string
  /** 弹窗播放用高清视频 */
  videoHd?: string
  videoPreload?: 'auto' | 'metadata' | 'none'
}

export const MARQUEE_ITEMS: MarqueeItem[] = MARQUEE_IMAGES.map((image, index) => {
  const videoConfig = MARQUEE_VIDEO_FILES[index]
  const caption = MARQUEE_CAPTIONS[index] || undefined

  if (videoConfig) {
    return {
      caption,
      image,
      video: asset(videoConfig.preview),
      videoHd: asset(videoConfig.hd),
      videoPreload: videoConfig.preload ?? 'metadata',
    }
  }

  return { image, caption }
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
        '具备 Unreal Engine 5、Unity、Ventuz 等实时渲染引擎及可视化交互系统的全流程项目经验，同时熟练掌握 WebGL 技术栈（如 Three.js、Babylon.js 等）的 Web 端 3D 可视化开发，能够高效协同前后端技术团队，推动从数据接入、渲染优化端到端交付落地',
    },
    {
      number: '04',
      name: 'AI 赋能提效',
      description:
        '熟练整合 Gemini、Cursor、Claude 等 AI 能力，赋能需求全链路分析、结构化文档输出及风险前瞻性预判，驱动研发效能与项目稳健性双提升。',
    },
    {
      number: '05',
      name: '敏捷协作落地',
      description:
        '具备扎实的敏捷管理实践经验，擅长通过迭代节奏把控与风险前置识别，推动跨角色高效协同；基于 TAPD 构建标准化研发流程，实现需求可追溯、进度可视化，有效提升交付效率与团队协作透明度。',
    },
  ],
}
