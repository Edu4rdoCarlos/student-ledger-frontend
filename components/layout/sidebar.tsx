"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  GraduationCap,
  Shield,
  Settings,
  Sparkles,
  Presentation,
  Book,
  Upload
} from "lucide-react"
import { useUser } from "@/lib/hooks/use-user-role"
import { getNavigationItems } from "@/lib/config/navigation"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: LayoutDashboard,
  file: FileText,
  users: Users,
  student: GraduationCap,
  presentation: Presentation,
  book: Book,
  building: Shield,
  shield: Shield,
  "user-check": Users,
  upload: Upload,
  settings: Settings,
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const navigation = user ? getNavigationItems(user) : []

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="flex h-16 items-center border-b border-border/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary">
              Academic Ledger
            </h1>
            <p className="text-[10px] text-muted-foreground">Sistema de TCC</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = iconMap[item.icon] || LayoutDashboard
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-primary opacity-20 blur-xl" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="rounded-xl bg-primary/10 dark:bg-primary/20 p-4 border border-primary/20 dark:border-primary/30">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary">Blockchain Powered</p>
              <p className="text-[10px] text-primary/80 mt-0.5">
                Hyperledger Fabric
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
