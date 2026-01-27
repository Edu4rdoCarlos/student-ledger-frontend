"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import {
  House,
  File,
  Users,
  GraduationCap,
  Shield,
  Gear,
  Cube,
  Presentation,
  Book,
  Upload,
  CaretLeft,
  CaretRight
} from "@phosphor-icons/react"
import { useUser } from "@/lib/hooks/use-user-role"
import { getNavigationItems } from "@/lib/config/navigation"
import { useSidebar } from "@/lib/contexts/sidebar-context"

const iconMap: Record<string, any> = {
  home: House,
  file: File,
  users: Users,
  student: GraduationCap,
  presentation: Presentation,
  book: Book,
  building: Shield,
  shield: Shield,
  "user-check": Users,
  upload: Upload,
  settings: Gear,
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const navigation = user ? getNavigationItems(user) : []

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-center border-b border-border/50 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold text-primary">
                Academic Ledger
              </h1>
              <p className="text-[10px] text-muted-foreground">Sistema de TCC</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 flex h-10 w-5 items-center justify-center rounded-l-lg bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300"
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? (
          <CaretRight className="h-4 w-4" />
        ) : (
          <CaretLeft className="h-4 w-4" />
        )}
      </button>

      <nav className={cn(
        "space-y-2",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = iconMap[item.icon] || House
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex items-center rounded-xl text-sm font-medium transition-all cursor-pointer",
                isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-primary opacity-20 blur-xl" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        "absolute bottom-0 left-0 right-0",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30",
          isCollapsed ? "flex items-center justify-center p-2" : "p-4"
        )}>
          {isCollapsed ? (
            <div title="Blockchain Powered">
              <Cube className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <div className="flex items-start gap-2 mb-2">
              <Cube className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary">Blockchain Powered</p>
                <p className="text-[10px] text-primary/80 mt-0.5">
                  Hyperledger Fabric
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
