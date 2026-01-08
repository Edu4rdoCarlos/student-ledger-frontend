"use client"

import { Bell, Search, LogOut, User } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { useAuthStore } from "@/lib/store/auth-store"
import { useNotificationStore } from "@/lib/store/notification-store"
import { RoleBadge } from "@/components/primitives/role-badge"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos, alunos..."
              className="pl-9 h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-[10px] font-bold text-white shadow-lg">
                {unreadCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-3 border-l border-border/50 pl-3 ml-1">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {user?.role && <RoleBadge role={user.role} />}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
