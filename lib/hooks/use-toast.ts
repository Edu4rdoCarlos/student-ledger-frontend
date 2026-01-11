import { toast as sonnerToast } from "sonner"

export type ToastType = "success" | "error" | "warning" | "info" | "loading"

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const toast = (type: ToastType, options: ToastOptions) => {
    const { title, description, duration = 4000, action } = options

    const message = title || description || ""
    const desc = title && description ? description : undefined

    const commonOptions = {
      description: desc,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    }

    switch (type) {
      case "success":
        return sonnerToast.success(message, commonOptions)
      case "error":
        return sonnerToast.error(message, commonOptions)
      case "warning":
        return sonnerToast.warning(message, commonOptions)
      case "info":
        return sonnerToast.info(message, commonOptions)
      case "loading":
        return sonnerToast.loading(message, commonOptions)
      default:
        return sonnerToast(message, commonOptions)
    }
  }

  return {
    toast,
    success: (options: ToastOptions) => toast("success", options),
    error: (options: ToastOptions) => toast("error", options),
    warning: (options: ToastOptions) => toast("warning", options),
    info: (options: ToastOptions) => toast("info", options),
    loading: (options: ToastOptions) => toast("loading", options),
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: Error) => string)
      }
    ) => sonnerToast.promise(promise, options),
  }
}
