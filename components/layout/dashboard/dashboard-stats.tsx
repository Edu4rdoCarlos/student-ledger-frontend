"use client";

import { FileText, CheckCircle, Clock, Shield } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { DashboardSummary } from "@/lib/types";

interface DashboardStatsProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export function DashboardStats({ summary, loading }: DashboardStatsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Documentos"
        value={loading ? "..." : summary?.totalDocuments ?? 0}
        icon={FileText}
        iconColor="text-primary"
      />
      <StatCard
        title="Documentos Pendentes"
        value={loading ? "..." : summary?.pendingDocuments ?? 0}
        icon={Clock}
        iconColor="text-amber-600"
      />
      <StatCard
        title="Documentos Aprovados"
        value={loading ? "..." : summary?.approvedDocuments ?? 0}
        icon={CheckCircle}
        iconColor="text-emerald-600"
      />
      <StatCard
        title="Total de Estudantes"
        value={loading ? "..." : summary?.totalStudents ?? 0}
        icon={Shield}
        iconColor="text-primary"
      />
    </div>
  );
}
