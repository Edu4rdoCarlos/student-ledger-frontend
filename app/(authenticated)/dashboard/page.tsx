"use client"
import { FileText, CheckCircle, Clock, Shield, ArrowRight, AlertCircle, User, LayoutDashboard, Briefcase, Calendar } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card"
import { useApprovals, type PendingApproval } from "@/hooks/use-approvals"
import { Button } from "@/components/primitives/button"
import { ApprovalDetailsModal } from "@/components/layout/approvals/approval-details-modal"
import Link from "next/link"
import { useState, useEffect } from "react"
import { defenseService } from "@/lib/services/defense-service"
import { summaryService } from "@/lib/services/summary-service"
import type { Defense, DashboardSummary } from "@/lib/types"

export default function DashboardPage() {
  const { approvals, loading: approvalsLoading } = useApprovals()
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [recentDefenses, setRecentDefenses] = useState<Defense[]>([])
  const [defensesLoading, setDefensesLoading] = useState(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    const fetchRecentDefenses = async () => {
      try {
        setDefensesLoading(true)
        const response = await defenseService.getAllDefenses(1, 3, "desc")
        setRecentDefenses(response.data)
      } catch (error) {
        console.error("Error fetching recent defenses:", error)
      } finally {
        setDefensesLoading(false)
      }
    }

    const fetchSummary = async () => {
      try {
        setSummaryLoading(true)
        const data = await summaryService.getDashboardSummary()
        setSummary(data)
      } catch (error) {
        console.error("Error fetching summary:", error)
      } finally {
        setSummaryLoading(false)
      }
    }

    fetchRecentDefenses()
    fetchSummary()
  }, [])

  const handleApprovalClick = (approval: PendingApproval) => {
    setSelectedApproval(approval)
    setModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">Visão geral do sistema de gerenciamento de TCC</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blockchain Secured</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Documentos"
            value={summaryLoading ? "..." : summary?.totalDocuments ?? 0}
            icon={FileText}
            iconColor="text-primary"
          />
          <StatCard
            title="Documentos Pendentes"
            value={summaryLoading ? "..." : summary?.pendingDocuments ?? 0}
            icon={Clock}
            iconColor="text-amber-600"
          />
          <StatCard
            title="Documentos Aprovados"
            value={summaryLoading ? "..." : summary?.approvedDocuments ?? 0}
            icon={CheckCircle}
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Total de Estudantes"
            value={summaryLoading ? "..." : summary?.totalStudents ?? 0}
            icon={Shield}
            iconColor="text-primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
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
              {defensesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                </div>
              ) : recentDefenses.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma defesa encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDefenses.map((defense) => (
                    <div
                      key={defense.id}
                      className="rounded-xl border border-border/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 space-y-3"
                    >
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Aprovações Pendentes
              </CardTitle>
              <CardDescription>Documentos aguardando sua aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              {approvalsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                </div>
              ) : approvals.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-emerald-600/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma aprovação pendente</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3">
                  {approvals.slice(0, 5).map((approval) => {
                    const signatures = approval.signatures || approval.approvals || []
                    const approvedCount = signatures.filter((s) => s.status === "APPROVED").length
                    const totalSignatures = signatures.length
                    const pendingRoles = signatures
                      .filter((s) => s.status === "PENDING")
                      .map((s) => s.role)
                      .join(", ")

                    return (
                      <div
                        key={approval.id}
                        onClick={() => handleApprovalClick(approval)}
                        className="group rounded-xl border border-border/50 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900/50 dark:to-orange-950/20 p-4 transition-all hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.02] cursor-pointer"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-start gap-2">
                                <FileText className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                                    {approval.documentTitle}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {approval.courseName}
                                  </p>
                                </div>
                              </div>

                              {approval.students.length > 0 && (
                                <div className="flex items-start gap-1.5 pl-5 w-full">
                                  <User className="h-2.5 w-2.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <span className="text-[10px] text-muted-foreground flex-1">
                                    {approval.students.map((s) => s.name).join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
                                <Clock className="h-2.5 w-2.5 text-amber-700 dark:text-amber-400" />
                                <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">
                                  {pendingRoles || approval.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pl-6">
                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(approvedCount / totalSignatures) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                              {approvedCount}/{totalSignatures}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {approvals.length > 5 && (
                    <Link href="/signatures">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        Ver todas ({approvals.length})
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ApprovalDetailsModal
        approval={selectedApproval}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </DashboardLayout>
  )
}
