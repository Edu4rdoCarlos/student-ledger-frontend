"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/shared/data-table";
import { TablePagination } from "@/components/shared/table-pagination";
import { Card } from "@/components/shared/card";
import { useStudentsPage } from "@/lib/hooks/use-students-page";
import {
  StudentDetailsModal,
  AddStudentDialog,
  StudentsHeader,
  getStudentColumns,
} from "@/components/layout/students";
import type { Student } from "@/lib/types";

export default function StudentsPage() {
  const {
    students,
    metadata,
    loading,
    selectedStudent,
    isModalOpen,
    loadingDetails,
    isAddDialogOpen,
    setIsModalOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleUpdateStudent,
    handleAddSuccess,
  } = useStudentsPage();

  const columns = getStudentColumns({
    onViewDetails: handleViewDetails,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <StudentsHeader onAddClick={() => setIsAddDialogOpen(true)} />

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <DataTable<Student>
            data={students}
            columns={columns}
            loading={loading}
            emptyMessage="Nenhum aluno encontrado"
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

      <StudentDetailsModal
        student={selectedStudent}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateStudent={handleUpdateStudent}
        loading={loadingDetails}
      />

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
    </DashboardLayout>
  );
}
