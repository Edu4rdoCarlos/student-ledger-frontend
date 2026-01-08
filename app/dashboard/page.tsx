"use client"
import { FileText, Users, CheckCircle, Clock, TrendingUp, Shield, ArrowRight, Sparkles } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card"
import { useDocuments } from "@/hooks/use-documents"
import { StatusBadge } from "@/components/primitives/status-badge"
import { Button } from "@/components/primitives/button"
import Link from "next/link"

export default function DashboardPage() {
  const { documents, loading } = useDocuments()

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "pendente").length,
    approved: documents.filter((d) => d.status === "aprovado").length,
    students: 24,
  }

  const recentDocuments = documents.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">Visão geral do sistema de gerenciamento de TCC</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Blockchain Secured</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total de Documentos" value={stats.total} icon={FileText} iconColor="text-blue-600" />
          <StatCard title="Pendentes" value={stats.pending} icon={Clock} iconColor="text-amber-600" />
          <StatCard title="Aprovados" value={stats.approved} icon={CheckCircle} iconColor="text-emerald-600" />
          <StatCard title="Alunos" value={stats.students} icon={Users} iconColor="text-indigo-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Documentos Recentes
                </CardTitle>
                <CardDescription>Últimas atualizações de documentos acadêmicos</CardDescription>
              </div>
              <Link href="/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 dark:hover:border-blue-700 cursor-pointer"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>
              ) : recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhum documento encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between rounded-xl border border-border/50 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.studentName} • {doc.course}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>Operações frequentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/documents">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 dark:hover:border-blue-800 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  Novo Documento
                </Button>
              </Link>
              <Link href="/students">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 dark:hover:border-indigo-800 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Gerenciar Alunos
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 dark:hover:border-emerald-800 cursor-pointer">
                  <Shield className="h-4 w-4" />
                  Verificar Hash
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
