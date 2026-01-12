"use client"

import { useState } from "react"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { useAuthStore } from "@/lib/store/auth-store"
import { getRoleTitle } from "@/lib/config/roles"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    // Aguarda o tema ser limpo antes de redirecionar
    await new Promise((resolve) => setTimeout(resolve, 100))
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6 justify-end">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                {user?.role && (
                  <p className="text-xs font-medium text-primary">
                    {getRoleTitle(user.role)}
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl cursor-pointer"
            >
              {isLoggingOut ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
