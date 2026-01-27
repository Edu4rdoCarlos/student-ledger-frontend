"use client"

import type React from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { SidebarProvider, useSidebar } from "@/lib/contexts/sidebar-context"
import { cn } from "@/lib/utils/cn"

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />

      <Sidebar />
      <div className={cn(
        "relative transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}
