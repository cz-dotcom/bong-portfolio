import {
  BarChart3,
  Box,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { asset } from '../lib/asset'

export type ProjectOutcome = {
  label: string
  detail: string
}

export type ProjectCase = {
  id: string
  title: string
  period: string
  timelineYears: string
  timelineOrder: number
  category: string
  image: string
  /** 翠鸟 Web3D 场景 ID，有值时在 Featured Case 左侧加载交互 3D */
  sceneId?: string
  /** 3D 示意场景保密说明文案 */
  sceneDemoNotice?: string
  icon: LucideIcon
  summary: string
  tags: string[]
  responsibilities: {
    icon: LucideIcon
    text: string
  }[]
  outcomes: ProjectOutcome[]
  timelineBullets: string[]
}

export const PROJECT_CASES: ProjectCase[] = [
  {
    id: 'zhonghai-hq',
    title: '中海总部大厦可视化项目',
    period: '2023.03 - 2025.02',
    timelineYears: '2023-2025',
    timelineOrder: 3,
    category: '数字孪生 / 智慧楼宇',
    image: asset('images/projects/zhonghai-hq-digital-twin.png'),
    sceneId: '11036',
    sceneDemoNotice: '个人渲染示意，非实际项目',
    icon: Building2,
    summary:
      '面向中海总部大厦的数字孪生可视化平台，整合楼宇设备、能耗、安防、环境等多源数据，实现统一监控与智能分析，助力楼宇精细化运营。',
    tags: ['数字孪生', '智慧楼宇', 'IOT 平台', '百万级项目'],
    responsibilities: [
      { icon: ClipboardList, text: '项目规划与资源统筹' },
      { icon: UsersRound, text: '产研测试跨团队协调' },
      { icon: UserRoundCheck, text: '验收交付与后续合作推进' },
    ],
    outcomes: [
      { label: '验收 100%', detail: '高质量交付通过验收' },
      { label: '百万级项目', detail: '规模化项目成功落地' },
      { label: '促进后续合作', detail: '客户满意，持续合作推进' },
    ],
    timelineBullets: ['整合多源数据统一监控', '能耗与设备智能分析', '项目验收 100% 通过'],
  },
  {
    id: 'zhonghai-nocode',
    title: '中海零代码三维空间工具平台',
    period: '2025.03 - 2026.03',
    timelineYears: '2025-2026',
    timelineOrder: 4,
    category: '零代码 / 三维空间',
    image: asset('images/projects/zhonghai-nocode-space.png'),
    icon: Box,
    summary:
      '面向中海地产小区业务沉淀三维空间配置平台，基于 CAD 图纸识别、预制组件和物联引擎，实现低代码化空间搭建与实时数据关联。',
    tags: ['三维空间', 'CAD 识别', '物联引擎', '集团平台'],
    responsibilities: [
      { icon: ClipboardList, text: '三维模型与组件能力规划' },
      { icon: UsersRound, text: '物联实时数据关联协同' },
      { icon: UserRoundCheck, text: '示范小区上线落地推进' },
    ],
    outcomes: [
      { label: '验收 100%', detail: '示范场景顺利上线' },
      { label: '平台化沉淀', detail: '支撑多小区业务复用' },
      { label: '物联打通', detail: '设备数据实时关联' },
    ],
    timelineBullets: ['低代码快速搭建三维场景', '物联设备接入与管理', '助力业务数字化升级'],
  },
  {
    id: 'mall-crm',
    title: '购物中心 SaaS CRM 交付',
    period: '2018.09 - 2021.05',
    timelineYears: '2018-2021',
    timelineOrder: 1,
    category: 'SaaS CRM / 商业会员',
    image: asset('images/projects/mall-saas-crm.png'),
    icon: BriefcaseBusiness,
    summary:
      '主导购物中心 SaaS CRM 系统交付，覆盖会员、营销、积分三大核心模块，持续优化标准交付流程，支撑客户成功与续签增长。',
    tags: ['SaaS CRM', '会员营销', '积分体系', '客户成功'],
    responsibilities: [
      { icon: ClipboardList, text: '版本迭代计划制定' },
      { icon: UsersRound, text: '客户需求与产研资源协调' },
      { icon: UserRoundCheck, text: '验收上线与续签支持' },
    ],
    outcomes: [
      { label: '40+ 商业项目', detail: '多项目并行成功交付' },
      { label: '验收 100%', detail: '核心项目稳定验收' },
      { label: '流程优化', detail: '沉淀标准交付方法' },
    ],
    timelineBullets: ['完成多项目并行交付', '口碑推荐带来新增客户', '客户续约率持续提升'],
  },
  {
    id: 'erp-ka',
    title: '商业 ERP / KA 大会员系统',
    period: '2021.05 - 2023.02',
    timelineYears: '2021-2023',
    timelineOrder: 2,
    category: 'ERP / KA 定制',
    image: asset('images/projects/erp-ka-membership.png'),
    icon: UsersRound,
    summary:
      '统筹高定大会员集团系统与商业 ERP 开发，完成 CRM、ERP、财务和数据中台业务打通，支撑复杂会员与营销场景稳定落地。',
    tags: ['KA 客户', '商业 ERP', '数据中台', '跨系统打通'],
    responsibilities: [
      { icon: ClipboardList, text: '复杂业务定制需求拆解' },
      { icon: UsersRound, text: '多方利益相关者沟通' },
      { icon: UserRoundCheck, text: '交付计划与风险控制' },
    ],
    outcomes: [
      { label: '跨团队交付', detail: '产研测试商务协同推进' },
      { label: '验收 100%', detail: '系统稳定上线使用' },
      { label: '业务打通', detail: '多系统数据流程贯通' },
    ],
    timelineBullets: ['支持千万级会员与复杂营销场景', '系统稳定性持续提升', '显著提升运营效率'],
  },
]

export const PROJECT_STATS = [
  { icon: Target, value: '8年+', label: '项目管理', detail: '互联网 / 地产 / SaaS' },
  { icon: BarChart3, value: '40+', label: '商业项目', detail: '多行业项目成功交付' },
  { icon: ShieldCheck, value: 'PMP', label: '认证', detail: '项目管理专业资质' },
  { icon: Sparkles, value: 'AI 工作流', label: '提效与创新', detail: 'AI 驱动计划 / 协同 / 文档自动化' },
] as const

export const TIMELINE_PROJECTS = [...PROJECT_CASES].sort(
  (a, b) => a.timelineOrder - b.timelineOrder,
)
