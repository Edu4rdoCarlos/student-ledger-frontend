"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { GraduationCap, User, Eye } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { TablePagination } from "@/components/shared/table-pagination"
import { useAdvisors } from "@/hooks/use-advisors"
import { Card } from "@/components/shared/card"
import type { Advisor } from "@/lib/types"
import { useState } from "react"

export default function AdvisorsPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const { advisors, metadata, loading } = useAdvisors(currentPage, 10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = (advisor: Advisor) => {
    // TODO: Implementar modal de detalhes do orientador
    console.log("Ver detalhes do orientador:", advisor)
  }

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (advisor: Advisor) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{advisor.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (advisor: Advisor) => (
        <span className="text-sm text-muted-foreground">{advisor.email}</span>
      ),
    },
    {
      key: "specialization",
      label: "Especialização",
      render: (advisor: Advisor) => (
        <span className="text-sm font-medium">{advisor.specialization}</span>
      ),
    },
    {
      key: "course",
      label: "Curso",
      render: (advisor: Advisor) => {
        const courseDisplay = `${advisor.course.name} (${advisor.course.code})`

        return (
          <div className="flex items-center gap-2" title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{advisor.course.name}</span>
              <span className="text-xs text-muted-foreground">{advisor.course.code}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: "activeAdvisorships",
      label: "Orientações Ativas",
      render: (advisor: Advisor) => {
        const count = advisor.activeAdvisorshipsCount

        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
              {count} {count === 1 ? "orientação" : "orientações"}
            </span>
          </div>
        )
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (advisor: Advisor) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleViewDetails(advisor)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Orientadores
              </h1>
            </div>
            <p className="text-muted-foreground">Gerencie os orientadores cadastrados no sistema</p>
          </div>
        </div>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable data={advisors} columns={columns} loading={loading} emptyMessage="Nenhum orientador encontrado" />
          {metadata && (
            <TablePagination
              metadata={metadata}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
