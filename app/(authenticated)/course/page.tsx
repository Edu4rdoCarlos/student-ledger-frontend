"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TablePagination } from "@/components/shared/table-pagination";
import { LoadingState } from "@/components/shared/loading-state";
import { useCoursesPage } from "@/lib/hooks/use-courses-page";
import {
  CourseDetailsModal,
  CourseFormDialog,
  CoursesHeader,
  CoursesEmptyState,
  CoursesGrid,
} from "@/components/layout/courses";

export default function CoursePage() {
  const {
    myCourses,
    otherCourses,
    metadata,
    loading,
    selectedCourse,
    isDetailsModalOpen,
    isFormDialogOpen,
    editingCourse,
    canCreate,
    showMyCoursesSection,
    setIsDetailsModalOpen,
    setIsFormDialogOpen,
    canEditCourse,
    handleViewDetails,
    handleEdit,
    handleCreate,
    handleFormSuccess,
    handlePageChange,
  } = useCoursesPage();

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando cursos..." className="min-h-[50vh]" />
      </DashboardLayout>
    );
  }

  const isEmpty = otherCourses.length === 0 && myCourses.length === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CoursesHeader showAddButton={canCreate} onAddClick={handleCreate} />

        {showMyCoursesSection && (
          <CoursesGrid
            courses={myCourses}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            canEditCourse={canEditCourse}
            title="Meus Cursos"
          />
        )}

        <div className="space-y-4">
          {showMyCoursesSection && (
            <h2 className="text-xl font-semibold">Outros Cursos</h2>
          )}

          {isEmpty ? (
            <CoursesEmptyState canCreate={canCreate} onCreateClick={handleCreate} />
          ) : otherCourses.length > 0 ? (
            <>
              <CoursesGrid
                courses={otherCourses}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                canEditCourse={canEditCourse}
              />

              {metadata && (
                <TablePagination
                  metadata={metadata}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : null}
        </div>
      </div>

      <CourseDetailsModal
        course={selectedCourse}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onEdit={handleEdit}
        canEdit={selectedCourse ? canEditCourse(selectedCourse) : false}
      />

      <CourseFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSuccess={handleFormSuccess}
        course={editingCourse}
      />
    </DashboardLayout>
  );
}
