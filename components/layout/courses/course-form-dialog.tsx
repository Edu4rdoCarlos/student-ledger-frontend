"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Switch } from "@/components/primitives/switch"
import { courseService } from "@/lib/services/course-service"
import { createCourseSchema, updateCourseSchema, type CreateCourseFormData, type UpdateCourseFormData } from "@/lib/validations/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Book, Hash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Course } from "@/lib/types"

interface CourseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  course?: Course | null
}

export function CourseFormDialog({ open, onOpenChange, onSuccess, course }: CourseFormDialogProps) {
  const isEditing = !!course

  const createForm = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      name: "",
      active: true,
      coordinatorId: undefined,
    },
  })

  const updateForm = useForm<UpdateCourseFormData>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      name: "",
      active: true,
      coordinatorId: undefined,
    },
  })

  const form = isEditing ? updateForm : createForm

  useEffect(() => {
    if (open) {
      if (isEditing && course) {
        updateForm.reset({
          name: course.name,
          active: course.active,
          coordinatorId: course.coordinator?.id,
        })
      } else {
        createForm.reset({
          code: "",
          name: "",
          active: true,
          coordinatorId: undefined,
        })
      }
    }
  }, [open, isEditing, course, createForm, updateForm])

  const onSubmitCreate = async (data: CreateCourseFormData) => {
    try {
      await courseService.createCourse({
        code: data.code,
        name: data.name,
        active: data.active,
        coordinatorId: data.coordinatorId || undefined,
      })

      toast.success("Curso criado com sucesso!")
      createForm.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao criar curso:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao criar curso", {
        description: errorMessage,
      })
    }
  }

  const onSubmitUpdate = async (data: UpdateCourseFormData) => {
    if (!course) return

    try {
      await courseService.updateCourse(course.id, {
        name: data.name,
        active: data.active,
        coordinatorId: data.coordinatorId || undefined,
      })

      toast.success("Curso atualizado com sucesso!")
      updateForm.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao atualizar curso:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao atualizar curso", {
        description: errorMessage,
      })
    }
  }

  const handleClose = () => {
    if (!form.formState.isSubmitting) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>{isEditing ? "Editar Curso" : "Novo Curso"}</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {isEditing ? "Atualize as informações do curso" : "Cadastre um novo curso no sistema"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={updateForm.handleSubmit(onSubmitUpdate)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Código
              </label>
              <Input
                value={course?.code || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">O código não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Book className="h-4 w-4" />
                Nome do Curso
              </label>
              <Input
                {...updateForm.register("name")}
                placeholder="Ciência da Computação"
                disabled={updateForm.formState.isSubmitting}
              />
              {updateForm.formState.errors.name && (
                <p className="text-sm text-red-600">{updateForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Curso ativo
              </label>
              <Switch
                className="cursor-pointer"
                checked={updateForm.watch("active") ?? true}
                onCheckedChange={(checked) => updateForm.setValue("active", checked)}
                disabled={updateForm.formState.isSubmitting}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleClose}
                disabled={updateForm.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateForm.formState.isSubmitting}
                className="cursor-pointer"
              >
                {updateForm.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Código
              </label>
              <Input
                {...createForm.register("code")}
                placeholder="CC-IES"
                disabled={createForm.formState.isSubmitting}
              />
              {createForm.formState.errors.code && (
                <p className="text-sm text-red-600">{createForm.formState.errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Book className="h-4 w-4" />
                Nome do Curso
              </label>
              <Input
                {...createForm.register("name")}
                placeholder="Ciência da Computação"
                disabled={createForm.formState.isSubmitting}
              />
              {createForm.formState.errors.name && (
                <p className="text-sm text-red-600">{createForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Curso ativo
              </label>
              <Switch
                className="cursor-pointer"
                checked={createForm.watch("active") ?? true}
                onCheckedChange={(checked) => createForm.setValue("active", checked)}
                disabled={createForm.formState.isSubmitting}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleClose}
                disabled={createForm.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createForm.formState.isSubmitting}
                className="cursor-pointer"
              >
                {createForm.formState.isSubmitting ? "Criando..." : "Criar Curso"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
