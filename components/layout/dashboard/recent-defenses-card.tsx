"use client";

import { FileText, ArrowRight, CheckCircle, Clock, User, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { Button } from "@/components/primitives/button";
import Link from "next/link";
import type { Defense } from "@/lib/types";

interface RecentDefensesCardProps {
  defenses: Defense[];
  loading: boolean;
}

function DefenseItem({ defense }: { defense: Defense }) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">
              {defense.title}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{defense.studentNames.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3 shrink-0" />
              <span className="truncate">{defense.advisorName}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {defense.result === "APPROVED" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium whitespace-nowrap">
              <CheckCircle className="h-3 w-3" />
              Aprovado
            </span>
          )}
          {defense.result === "FAILED" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium whitespace-nowrap">
              Reprovado
            </span>
          )}
          {defense.result === "PENDING" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
              <Clock className="h-3 w-3" />
              Pendente
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Defesa: {new Date(defense.defenseDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })} às {new Date(defense.defenseDate).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
    </div>
  );
}

function DefensesEmptyState() {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">Nenhuma defesa encontrada</p>
    </div>
  );
}

function DefensesLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}

export function RecentDefensesCard({ defenses, loading }: RecentDefensesCardProps) {
  return (
    <Card className="lg:col-span-2 border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            TCCs Recentes
          </CardTitle>
          <CardDescription>Últimas atualizações de TCCs acadêmicos</CardDescription>
        </div>
        <Link href="/defenses">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30 dark:border-primary/30 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/40 cursor-pointer"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <DefensesLoading />
        ) : defenses.length === 0 ? (
          <DefensesEmptyState />
        ) : (
          <div className="space-y-3">
            {defenses.map((defense) => (
              <DefenseItem key={defense.id} defense={defense} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
