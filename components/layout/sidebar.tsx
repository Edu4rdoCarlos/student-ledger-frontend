"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, GraduationCap, Shield, Settings, Sparkles } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Alunos", href: "/students", icon: GraduationCap },
  { name: "Orientadores", href: "/orientadores", icon: Users },
  { name: "Verificar Hash", href: "/verify", icon: Shield },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="flex h-16 items-center border-b border-border/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Academic Ledger
            </h1>
            <p className="text-[10px] text-muted-foreground">Sistema de TCC</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-muted-foreground hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-400",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 border border-blue-200/50 dark:border-blue-800/30">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Blockchain Powered</p>
              <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5">
                Hyperledger Fabric
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
