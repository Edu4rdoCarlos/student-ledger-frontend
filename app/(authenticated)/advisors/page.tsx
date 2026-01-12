"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { GraduationCap, User, Eye, Plus, CheckCircle2, XCircle } from "lucide-react"
import { DataTable } from "@/components/shared/data-table"
import { TablePagination } from "@/components/shared/table-pagination"
import { useAdvisors } from "@/hooks/use-advisors"
import { Card } from "@/components/shared/card"
import type { Advisor } from "@/lib/types"
import { useState } from "react"
import { AdvisorDetailsModal } from "@/components/layout/advisors/advisor-details-modal"
import { AddAdvisorDialog } from "@/components/layout/advisors/add-advisor-dialog"
import { advisorService } from "@/lib/services/advisor-service"

export default function AdvisorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { advisors, metadata, loading, refetch } = useAdvisors(currentPage, 10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewDetails = async (advisor: Advisor) => {
    try {
      setLoadingDetails(true)
      setIsModalOpen(true)

      const fullAdvisorData = await advisorService.getAdvisorById(advisor.userId)
      setSelectedAdvisor(fullAdvisorData)
    } catch (error) {
      console.error("Erro ao buscar detalhes do orientador:", error)
      setSelectedAdvisor(advisor)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUpdateAdvisor = async (id: string, data: { name: string; specialization: string; courseId: string; isActive: boolean }) => {
    try {
      await advisorService.updateAdvisor(id, data)
      const updatedAdvisor = await advisorService.getAdvisorById(id)
      setSelectedAdvisor(updatedAdvisor)
      await refetch(currentPage, 10)
    } catch (error) {
      console.error("Erro ao atualizar orientador:", error)
      throw error
    }
  }

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true
        return (
          <div className={`flex items-center gap-3 ${!isActive ? "opacity-50" : ""}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-primary/10 dark:bg-primary/20" : "bg-muted"}`}>
              <User className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`font-semibold ${!isActive ? "text-muted-foreground" : ""}`}>{advisor.name}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "email",
      label: "Email",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true
        return (
          <span className={`text-sm text-muted-foreground ${!isActive ? "opacity-50" : ""}`}>{advisor.email}</span>
        )
      },
    },
    {
      key: "course",
      label: "Curso",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true
        const courseDisplay = `${advisor.course.name} (${advisor.course.code})`

        return (
          <div className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`} title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${!isActive ? "text-muted-foreground" : ""}`}>{advisor.course.name}</span>
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
        const isActive = advisor.isActive ?? true
        const count = advisor.activeAdvisorshipsCount

        return (
          <div className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`}>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {count} {count === 1 ? "orientação" : "orientações"}
            </span>
          </div>
        )
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true

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
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Novo Orientador
          </Button>
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

      <AdvisorDetailsModal
        advisor={selectedAdvisor}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateAdvisor={handleUpdateAdvisor}
        loading={loadingDetails}
      />

      <AddAdvisorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => refetch(currentPage, 10)}
      />
    </DashboardLayout>
  )
}
