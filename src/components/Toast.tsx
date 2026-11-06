import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import type { ToastState } from '../types'

interface ToastProps {
  toast: ToastState
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = toast.tone === 'error' ? AlertCircle : toast.tone === 'info' ? Info : CheckCircle2

  return (
    <div className={`toast toast--${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
      <Icon size={17} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" className="toast__close" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  )
}
