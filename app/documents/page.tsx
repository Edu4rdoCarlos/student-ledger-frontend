"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Plus, Filter, FileText, Sparkles, Eye } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/primitives/status-badge"
import { useDocuments } from "@/hooks/use-documents"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import { Card } from "@/components/shared/card"

export default function DocumentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>()
  const { documents, loading } = useDocuments({ status: statusFilter })

  const columns = [
    {
      key: "title",
      label: "Título",
      render: (doc: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">{doc.title}</p>
            <p className="text-xs text-muted-foreground">{doc.type === "ata" ? "Ata de Defesa" : "Ficha de Avaliação"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "studentName",
      label: "Aluno",
      render: (doc: any) => (
        <div>
          <p className="font-medium">{doc.studentName}</p>
          <p className="text-xs text-muted-foreground">{doc.course}</p>
        </div>
      ),
    },
    {
      key: "orientadorName",
      label: "Orientador",
    },
    {
      key: "status",
      label: "Status",
      render: (doc: any) => <StatusBadge status={doc.status} />,
    },
    {
      key: "version",
      label: "Versão",
      render: (doc: any) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium">
          v{doc.version}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (doc: any) => (
        <Link href={`/documents/${doc.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary cursor-pointer">
            <Eye className="h-4 w-4" />
            Ver detalhes
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Documentos
              </h1>
            </div>
            <p className="text-muted-foreground">Gerencie atas e fichas de avaliação de TCC</p>
          </div>
          <Link href="/documents/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer">
              <Plus className="h-4 w-4" />
              Novo Documento
            </Button>
          </Link>
        </div>

        <Card className="p-4 border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros:
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] border-border/50 bg-background/50">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter && statusFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter(undefined)}
                className="h-8 text-xs cursor-pointer"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </Card>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable data={documents} columns={columns} loading={loading} emptyMessage="Nenhum documento encontrado" />
        </Card>
      </div>
    </DashboardLayout>
  )
}
