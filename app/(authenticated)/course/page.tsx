"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card"
import { Button } from "@/components/primitives/button"
import { Book, Plus } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user-role"
import { isAdmin, isCoordinator, isStudent } from "@/lib/types"
import type { Course } from "@/lib/types/course"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useCourses } from "@/hooks/use-courses"
import { CourseCard } from "@/components/layout/courses/course-card"
import { CourseDetailsModal } from "@/components/layout/courses/course-details-modal"
import { CourseFormDialog } from "@/components/layout/courses/course-form-dialog"
import { TablePagination } from "@/components/shared/table-pagination"

export default function CoursePage() {
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1)
  const { courses, myCourses, metadata, loading, refetch } = useCourses(currentPage, 12)

  const otherCourses = useMemo(() => {
    if (!user || !isCoordinator(user) || myCourses.length === 0) {
      return courses
    }
    const myCoursesIds = new Set(myCourses.map(c => c.id))
    return courses.filter(course => !myCoursesIds.has(course.id))
  }, [courses, myCourses, user])

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const canCreate = user ? isAdmin(user) : false 
  const canEditCourse = (course: Course) => {
    if (!user) return false
    if (isStudent(user)) return false
    if (isAdmin(user)) return true
    if (isCoordinator(user) && course.coordinator?.email === user.email) return true
    return false
  }

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course)
    setIsDetailsModalOpen(true)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setIsFormDialogOpen(true)
    setIsDetailsModalOpen(false)
  }

  const handleCreate = () => {
    setEditingCourse(null)
    setIsFormDialogOpen(true)
  }

  const handleFormSuccess = () => {
    refetch()
    setEditingCourse(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando cursos...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Cursos</h1>
            <p className="text-muted-foreground">
              Gerencie os cursos do sistema
            </p>
          </div>
          {canCreate && (
            <Button className="cursor-pointer" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          )}
        </div>

        {user && isCoordinator(user) && myCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Meus Cursos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {myCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  canEdit={canEditCourse(course)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {user && isCoordinator(user) && myCourses.length > 0 && (
            <h2 className="text-xl font-semibold">Outros Cursos</h2>
          )}

          {otherCourses.length === 0 && myCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Não há cursos cadastrados no sistema.
                </p>
                {canCreate && (
                  <Button className="mt-4 cursor-pointer" onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Curso
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : otherCourses.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    canEdit={canEditCourse(course)}
                  />
                ))}
              </div>

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
  )
}
