"use client"

import { useState, useEffect } from "react"
import { LogOut, User, KeyRound } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { getRoleTitle } from "@/lib/config/roles"
import { useRouter } from "next/navigation"
import { ChangePasswordModal } from "./change-password-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu"

export function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [isFirstAccessModal, setIsFirstAccessModal] = useState(false)

  useEffect(() => {
    if (user?.isFirstAccess && user.role !== "ADMIN" && user.role !== "COORDINATOR") {
      setShowChangePasswordModal(true)
      setIsFirstAccessModal(true)
    } else if (!user?.isFirstAccess && isFirstAccessModal) {
      setShowChangePasswordModal(false)
      setIsFirstAccessModal(false)
    }
  }, [user?.isFirstAccess, user?.role, isFirstAccessModal])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    await new Promise((resolve) => setTimeout(resolve, 100))
    router.push("/login")
  }

  const handlePasswordChangeSuccess = () => {
    setShowChangePasswordModal(false)
    setIsFirstAccessModal(false)
  }

  const handleOpenChangePassword = () => {
    setIsFirstAccessModal(false)
    setShowChangePasswordModal(true)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg supports-backdrop-filter:bg-white/80 dark:bg-slate-900/80 shadow-sm">
        <div className="flex h-16 items-center gap-4 px-6 justify-end">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 cursor-pointer rounded-xl p-2 hover:bg-muted/50 transition-colors outline-none">
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleOpenChangePassword}
                  className="cursor-pointer"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Alterar Senha
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  {isLoggingOut ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={showChangePasswordModal}
        onSuccess={handlePasswordChangeSuccess}
        isFirstAccess={isFirstAccessModal}
      />
    </>
  )
}
