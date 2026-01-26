"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Book, User, Mail, Calendar, Pencil, CheckCircle, XCircle } from "lucide-react"
import type { Course } from "@/lib/types"

interface CourseDetailsModalProps {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (course: Course) => void
  canEdit?: boolean
  loading?: boolean
}

export function CourseDetailsModal({
  course,
  open,
  onOpenChange,
  onEdit,
  canEdit = false,
  loading = false,
}: CourseDetailsModalProps) {
  if (!course) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {loading ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Carregando detalhes do curso</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Carregando detalhes...</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p>{course.name}</p>
                  <p className="text-sm font-normal text-muted-foreground mt-1  ">
                    {course.code}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nome do Curso</label>
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{course.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Código</label>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{course.code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {course.active ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-base text-green-600 dark:text-green-400">Ativo</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <p className="text-base text-red-600 dark:text-red-400">Inativo</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Coordenador</label>
                  {course.coordinator ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{course.coordinator.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${course.coordinator.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {course.coordinator.email}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sem coordenador definido</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{formatDate(course.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Atualizado em</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{formatDate(course.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {canEdit && onEdit && (
                <div className="flex justify-end pt-4 border-t">
                  <Button className="cursor-pointer" onClick={() => onEdit(course)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Curso
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
