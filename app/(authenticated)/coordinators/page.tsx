"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/shared/data-table";
import { TablePagination } from "@/components/shared/table-pagination";
import { Card } from "@/components/shared/card";
import { PageHeader } from "@/components/shared/page-header";
import { useCoordinatorsPage } from "@/lib/hooks/use-coordinators-page";
import { AddCoordinatorDialog, getCoordinatorColumns } from "@/components/layout/coordinators";
import { EditCoordinatorDialog } from "@/components/layout/coordinators/edit-coordinator-dialog";
import type { Coordinator } from "@/lib/types";

export default function CoordinatorsPage() {
  const {
    coordinators,
    metadata,
    loading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleAddSuccess,
  } = useCoordinatorsPage();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);

  const handleViewDetails = (coordinator: Coordinator) => {
    setSelectedCoordinator(coordinator);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    handleAddSuccess();
  };

  const columns = getCoordinatorColumns({ onViewDetails: handleViewDetails });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          icon={Shield}
          title="Coordenadores"
          description="Gerencie os coordenadores cadastrados no sistema"
          buttonLabel="Novo Coordenador"
          onButtonClick={() => setIsAddDialogOpen(true)}
        />

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable<Coordinator>
            data={coordinators}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhum coordenador encontrado"
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

      <AddCoordinatorDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      <EditCoordinatorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
        coordinator={selectedCoordinator}
      />
    </DashboardLayout>
  );
}
