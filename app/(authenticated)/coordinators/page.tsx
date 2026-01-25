"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Shield, User, Eye, Plus, CheckCircle2, XCircle, GraduationCap } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { TablePagination } from "@/components/shared/table-pagination"
import { useCoordinators } from "@/hooks/use-coordinators"
import { Card } from "@/components/shared/card"
import type { Coordinator } from "@/lib/types"
import { useState } from "react"
import { AddCoordinatorDialog } from "@/components/layout/coordinators/add-coordinator-dialog"

export default function CoordinatorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { coordinators, metadata, loading, refetch } = useCoordinators(currentPage, 10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true
        return (
          <div className={`flex items-center gap-3 ${!isActive ? "opacity-50" : ""}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-primary/10 dark:bg-primary/20" : "bg-muted"}`}>
              <User className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`font-semibold ${!isActive ? "text-muted-foreground" : ""}`}>{coordinator.name}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "email",
      label: "Email",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true
        return (
          <span className={`text-sm text-muted-foreground ${!isActive ? "opacity-50" : ""}`}>{coordinator.email}</span>
        )
      },
    },
    {
      key: "course",
      label: "Curso",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true

        if (!coordinator.course) {
          return (
            <span className={`text-sm text-muted-foreground italic ${!isActive ? "opacity-50" : ""}`}>
              Sem curso atribuído
            </span>
          )
        }

        const courseDisplay = `${coordinator.course.name} (${coordinator.course.code})`

        return (
          <div className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`} title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${!isActive ? "text-muted-foreground" : ""}`}>{coordinator.course.name}</span>
              <span className="text-xs text-muted-foreground">{coordinator.course.code}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true

        return (
          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Ativo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Inativo
              </span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Coordenadores
              </h1>
            </div>
            <p className="text-muted-foreground">Gerencie os coordenadores cadastrados no sistema</p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Novo Coordenador
          </Button>
        </div>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable data={coordinators} columns={columns} loading={loading} emptyMessage="Nenhum coordenador encontrado" />
          {metadata && (
            <TablePagination
              metadata={metadata}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </Card>
      </div>

      <AddCoordinatorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => refetch(currentPage, 10)}
      />
    </DashboardLayout>
  )
}
