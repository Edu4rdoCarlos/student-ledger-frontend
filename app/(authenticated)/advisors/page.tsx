"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/shared/data-table";
import { TablePagination } from "@/components/shared/table-pagination";
import { Card } from "@/components/shared/card";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAdvisorsPage } from "@/lib/hooks/use-advisors-page";
import {
  AdvisorDetailsModal,
  AddAdvisorDialog,
  AdvisorsHeader,
  getAdvisorColumns,
} from "@/components/layout/advisors";
import type { Advisor } from "@/lib/types";

export default function AdvisorsPage() {
  const { user } = useAuthStore();
  const {
    advisors,
    metadata,
    loading,
    selectedAdvisor,
    isModalOpen,
    loadingDetails,
    isAddDialogOpen,
    setIsModalOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleUpdateAdvisor,
    handleAddSuccess,
  } = useAdvisorsPage();

  const columns = getAdvisorColumns({
    currentUserId: user?.id,
    onViewDetails: handleViewDetails,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AdvisorsHeader onAddClick={() => setIsAddDialogOpen(true)} />

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable<Advisor>
            data={advisors}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhum orientador encontrado"
          />
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
        onSuccess={handleAddSuccess}
      />
    </DashboardLayout>
  );
}
