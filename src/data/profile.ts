import { asset } from '../lib/asset'

export const PORTRAIT_URL = asset('images/portrait-bong.png')

export const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

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
  heroTagline: 'Professional Software Project Manager',
  aboutText:
    'With more than eight years of experience in project management, I focus on SaaS, CRM, ERP, and building digital visualization. I truly enjoy working with teams that aim to stand out and deliver exceptional results. Let\'s build something incredible together!',
  aboutTextZh:
    '拥有 8 年以上互联网软件项目管理经验，深耕 SaaS、CRM、ERP 及建筑数字化可视化领域。持有 PMP 认证，擅长 KA 大客户统筹与跨团队敏捷交付。期待与你共创下一个精彩项目！',
  contact: {
    email: '498671303@qq.com',
    phone: '15625902355',
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
