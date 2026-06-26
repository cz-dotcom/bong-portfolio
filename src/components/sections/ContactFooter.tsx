import { Mail } from 'lucide-react'
import { profile } from '../../data/profile'
import { useCopyFeedback } from '../../hooks/useCopyFeedback'
import ContactButton from '../ui/ContactButton'
import WeChatIcon from '../ui/WeChatIcon'

export default function ContactFooter() {
  const { copied, copy } = useCopyFeedback()

  const itemClass =
    'inline-flex items-center gap-2 rounded-full border border-mist/10 px-4 py-2 text-sm text-mist/70 transition-colors hover:border-mist/25 hover:text-mist'

  return (
    <footer
      id="contact"
      className="border-t border-mist/10 px-4 pb-16 pt-12 text-center sm:px-0 sm:pb-20 sm:pt-16"
    >
      <p className="mb-2 text-sm uppercase tracking-widest text-mist/50">
        {profile.displayName} · {profile.title}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => copy(profile.contact.wechat)}
          className={itemClass}
          title="点击复制微信号"
        >
          <WeChatIcon className="h-4 w-4 text-[#07C160]" />
          <span>{copied ? '复制成功' : profile.contact.wechat}</span>
        </button>

        <a href={`mailto:${profile.contact.email}`} className={itemClass}>
          <Mail className="h-4 w-4 text-[#FF9FFC]" />
          <span>{profile.contact.email}</span>
        </a>
      </div>

      <p className="mt-4 text-sm text-mist/40">{profile.contact.location}</p>

      <div className="mt-8">
        <ContactButton label="联系我" />
      </div>
    </footer>
  )
}
