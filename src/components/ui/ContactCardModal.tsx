import { AnimatePresence, motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { useEffect } from 'react'
import { useCopyFeedback } from '../../hooks/useCopyFeedback'
import { PORTRAIT_URL, profile } from '../../data/profile'
import { CURRENT_COMPANY } from '../../data/companies'
import WeChatIcon from './WeChatIcon'

type ContactCardModalProps = {
  open: boolean
  onClose: () => void
}

export default function ContactCardModal({ open, onClose }: ContactCardModalProps) {
  const { copied, copy } = useCopyFeedback()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const copyWeChat = () => copy(profile.contact.wechat)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-card-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="关闭"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-mist/15 bg-[#111] shadow-2xl"
            style={{
              boxShadow:
                '0 24px 80px rgba(118, 33, 176, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  'linear-gradient(90deg, #5227FF, #FF9FFC, #B497CF, #BE4C00)',
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-mist/60 transition-colors hover:bg-white/5 hover:text-mist"
              aria-label="关闭名片"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-6 pb-6 pt-8 text-center">
              <div className="mx-auto mb-4 flex h-28 w-20 items-end justify-center overflow-hidden rounded-2xl border border-mist/10 bg-dark">
                <img
                  src={PORTRAIT_URL}
                  alt={profile.displayName}
                  className="max-h-full w-full object-contain object-bottom"
                />
              </div>

              <h2
                id="contact-card-title"
                className="text-xl font-semibold uppercase tracking-wide text-mist"
              >
                {profile.displayName}
              </h2>
              <p className="mt-1 text-xs text-mist/40">{profile.contact.location}</p>

              <div className="mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-mist/10 bg-white/[0.03] px-4 py-3">
                <img
                  src={CURRENT_COMPANY.logo}
                  alt={CURRENT_COMPANY.name}
                  className="h-5 w-auto max-w-[7.5rem] object-contain"
                />
                <p className="text-xs text-mist/65">翠鸟智擎 项目经理</p>
              </div>

              <ul className="mt-5 space-y-3 text-left">
                <li>
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="flex items-center gap-3 rounded-xl border border-mist/10 bg-white/[0.03] px-4 py-3 text-sm text-mist transition-colors hover:border-mist/25 hover:bg-white/[0.06]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#FF9FFC]" />
                    <span className="break-all">{profile.contact.email}</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={copyWeChat}
                    className="flex w-full items-center gap-3 rounded-xl border border-mist/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-mist transition-colors hover:border-mist/25 hover:bg-white/[0.06]"
                    title="点击复制微信号"
                  >
                    <WeChatIcon className="h-4 w-4 shrink-0 text-[#07C160]" />
                    <span>
                      微信 · {profile.contact.wechat}
                      <span
                        className={`ml-2 text-xs transition-colors ${
                          copied ? 'text-[#07C160]' : 'text-mist/40'
                        }`}
                      >
                        {copied ? '复制成功' : '点击复制'}
                      </span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
