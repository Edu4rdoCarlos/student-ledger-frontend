"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { useDefensesPage } from "@/lib/hooks/use-defenses-page";
import {
  DefensesHeader,
  DefensesEmptyState,
  DefensesGrid,
  DefensesSearch,
  DefenseFormDialog,
} from "@/components/layout/defenses";

export default function DefensesPage() {
  const {
    myDefenses,
    otherDefenses,
    defenses,
    loading,
    searchQuery,
    setSearchQuery,
    isFormDialogOpen,
    setIsFormDialogOpen,
    advisors,
    students,
    canCreateDefense,
    handleViewDetails,
    handleFormSuccess,
    handleOpenDialog,
  } = useDefensesPage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DefensesHeader
          showAddButton={canCreateDefense}
          onAddClick={handleOpenDialog}
        />

        {loading ? (
          <LoadingState message="Carregando defesas..." />
        ) : defenses.length === 0 ? (
          <DefensesEmptyState />
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Minhas Defesas</h2>
                <p className="text-sm text-muted-foreground">
                  Defesas em que você está envolvido
                </p>
              </div>
              {myDefenses.length > 0 ? (
                <DefensesGrid
                  defenses={myDefenses}
                  onViewDetails={handleViewDetails}
                  canCreateDefense={canCreateDefense}
                  scrollable
                />
              ) : (
                <DefensesEmptyState
                  message=""
                  description="Você ainda não está participando de nenhuma defesa."
                  compact
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Outras Defesas</h2>
                  <p className="text-sm text-muted-foreground">
                    Defesas públicas do sistema
                  </p>
                </div>
                <DefensesSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
              {otherDefenses.length > 0 ? (
                <DefensesGrid
                  defenses={otherDefenses}
                  onViewDetails={handleViewDetails}
                  canCreateDefense={canCreateDefense}
                />
              ) : (
                <DefensesEmptyState
                  message=""
                  description="Não há outras defesas públicas cadastradas no momento."
                  compact
                />
              )}
            </div>
          </>
        )}
      </div>

      <DefenseFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSuccess={handleFormSuccess}
        advisors={advisors}
        students={students}
      />
    </DashboardLayout>
  );
}
