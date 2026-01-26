"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import { useCourses } from "@/hooks/use-courses"
import { studentService } from "@/lib/services/student-service"
import { addStudentSchema, type AddStudentFormData } from "@/lib/validations/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCap, Mail, User, Hash } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { useEffect } from "react"

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddStudentDialog({ open, onOpenChange, onSuccess }: AddStudentDialogProps) {
  const { myCourses, loading: loadingCourses } = useCourses()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddStudentFormData>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      registration: "",
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

  const onSubmit = async (data: AddStudentFormData) => {
    try {
      await studentService.createStudent({
        registration: data.registration,
        email: data.email,
        name: data.name,
        courseId: data.courseId,
      })

      toast.success("Aluno cadastrado com sucesso!")
      reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao cadastrar aluno", {
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
              <p>Novo Aluno</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Cadastre um novo aluno no sistema
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Matrícula
            </label>
            <Input
              {...register("registration")}
              placeholder="20231001"
              disabled={isSubmitting}
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                  e.preventDefault()
                }
              }}
            />
            {errors.registration && (
              <p className="text-sm text-red-600">{errors.registration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo
            </label>
            <Input
              {...register("name")}
              placeholder="João da Silva"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="aluno@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
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
                    {myCourses.map((course) => (
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar Aluno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
