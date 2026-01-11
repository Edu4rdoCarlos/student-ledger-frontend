"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"

const ROLE_THEME_MAP = {
  STUDENT: "theme-student",
  ADVISOR: "theme-advisor",
  COORDINATOR: "theme-coordinator",
  ADMIN: "theme-admin",
} as const

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    document.documentElement.classList.remove(
      "theme-student",
      "theme-advisor",
      "theme-coordinator",
      "theme-admin"
    )

    if (user?.role && user.role in ROLE_THEME_MAP) {
      document.documentElement.classList.add(ROLE_THEME_MAP[user.role])
    }
  }, [user?.role, mounted])

  return <>{children}</>
}
