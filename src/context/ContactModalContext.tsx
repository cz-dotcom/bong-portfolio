import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import ContactCardModal from '../components/ui/ContactCardModal'

type ContactModalContextValue = {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  return (
    <ContactModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
      <ContactCardModal open={open} onClose={closeModal} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) {
    throw new Error('useContactModal must be used within ContactModalProvider')
  }
  return ctx
}
