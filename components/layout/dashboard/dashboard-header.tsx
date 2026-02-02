"use client";

import { LayoutDashboard, Shield } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-primary">
            Dashboard
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">Visão geral do sistema de gerenciamento de TCC</p>
      </div>
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">Blockchain Secured</span>
      </div>
    </div>
  );
}
