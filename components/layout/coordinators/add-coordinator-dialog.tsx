"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import { useCourses } from "@/hooks/use-courses"
import { coordinatorService } from "@/lib/services/coordinator-service"
import { addCoordinatorSchema, type AddCoordinatorFormData } from "@/lib/validations/coordinator"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCap, Mail, User } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { useEffect } from "react"

interface AddCoordinatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddCoordinatorDialog({ open, onOpenChange, onSuccess }: AddCoordinatorDialogProps) {
  const { courses, loading: loadingCourses } = useCourses()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCoordinatorFormData>({
    resolver: zodResolver(addCoordinatorSchema),
    defaultValues: {
      email: "",
      name: "",
      courseId: "",
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: AddCoordinatorFormData) => {
    try {
      await coordinatorService.createCoordinator({
        email: data.email,
        name: data.name,
        courseId: data.courseId,
      })

      toast.success("Coordenador cadastrado com sucesso!")
      reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao cadastrar coordenador:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido"
      toast.error("Erro ao cadastrar coordenador", {
        description: errorMessage,
      })
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>Novo Coordenador</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Cadastre um novo coordenador no sistema
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="coordenador@universidade.edu.br"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo
            </label>
            <Input
              {...register("name")}
              placeholder="Prof. Dr. João Silva"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Curso
            </label>
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting || loadingCourses}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingCourses ? "Carregando cursos..." : "Selecione o curso"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && (
              <p className="text-sm text-red-600">{errors.courseId.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingCourses}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Coordenador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
