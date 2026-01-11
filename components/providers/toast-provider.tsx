"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "backdrop-blur-sm",
          title: "text-sm font-semibold",
          description: "text-sm",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "bg-background border-border",
        },
      }}
    />
  )
}
