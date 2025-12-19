import { toast as rtToast, type ToastOptions as RtToastOptions } from 'react-toastify'

type ToastPayload = {
  title?: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  options?: RtToastOptions
}

export function useToast() {
  const toast = ({ title, description, type = 'info', options }: ToastPayload) => {
    const message = title && description ? `${title}\n${description}` : (title || description || '')

    switch (type) {
      case 'success':
        rtToast.success(message, options)
        break
      case 'error':
        rtToast.error(message, options)
        break
      case 'warning':
        rtToast.warn(message, options)
        break
      default:
        rtToast.info(message, options)
    }
  }

  return { toast }
}
