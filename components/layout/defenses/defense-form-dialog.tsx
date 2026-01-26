"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { defenseService } from "@/lib/services/defense-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, MapPin, Users, Plus, Trash2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import type { Advisor, Student } from "@/lib/types"

const createDefenseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  defenseDate: z.string().min(1, "Data da defesa é obrigatória"),
  location: z.string().min(1, "Local é obrigatório"),
  advisorId: z.string().min(1, "Orientador é obrigatório"),
  studentIds: z.array(z.string())
    .min(1, "Pelo menos um estudante é obrigatório")
    .max(2, "Você pode selecionar no máximo 2 estudantes"),
  examBoard: z.array(
    z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      email: z.string().email("E-mail inválido"),
    })
  ).min(1, "Pelo menos um membro da banca é obrigatório"),
})

type CreateDefenseFormData = z.infer<typeof createDefenseSchema>

interface DefenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  advisors?: Advisor[]
  students?: Student[]
}

export function DefenseFormDialog({ open, onOpenChange, onSuccess, advisors = [], students = [] }: DefenseFormDialogProps) {
  const router = useRouter()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  useEffect(() => {
    console.log("DefenseFormDialog - Advisors:", advisors)
    console.log("DefenseFormDialog - Students:", students)
  }, [advisors, students])

  const form = useForm<CreateDefenseFormData>({
    resolver: zodResolver(createDefenseSchema),
    defaultValues: {
      title: "",
      defenseDate: "",
      location: "",
      advisorId: "",
      studentIds: [],
      examBoard: [{ name: "", email: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "examBoard",
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        defenseDate: "",
        location: "",
        advisorId: "",
        studentIds: [],
        examBoard: [{ name: "", email: "" }],
      })
      setSelectedStudents([])
    }
  }, [open, form])

  const onSubmit = async (data: CreateDefenseFormData) => {
    try {
      await defenseService.createDefense({
        title: data.title,
        defenseDate: data.defenseDate,
        location: data.location,
        advisorId: data.advisorId,
        studentIds: data.studentIds,
        examBoard: data.examBoard,
      })

      toast.success("Defesa criada com sucesso!")
      form.reset()
      setSelectedStudents([])
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao criar defesa:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao criar defesa", {
        description: errorMessage,
      })
    }
  }

  const handleClose = () => {
    if (!form.formState.isSubmitting) {
      form.reset()
      setSelectedStudents([])
      onOpenChange(false)
    }
  }

  const handleStudentToggle = (studentId: string) => {
    const isCurrentlySelected = selectedStudents.includes(studentId)

    if (isCurrentlySelected) {
      const newSelected = selectedStudents.filter(id => id !== studentId)
      setSelectedStudents(newSelected)
      form.setValue("studentIds", newSelected)
    } else {
      if (selectedStudents.length >= 2) {
        toast.error("Limite atingido", {
          description: "Você pode selecionar no máximo 2 estudantes por defesa",
        })
        return
      }
      const newSelected = [...selectedStudents, studentId]
      setSelectedStudents(newSelected)
      form.setValue("studentIds", newSelected)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>Nova Defesa</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Cadastre uma nova defesa no sistema
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Título da Defesa
            </label>
            <Input
              {...form.register("title")}
              placeholder="Thesis Defense - Management System"
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data e Hora da Defesa
            </label>
            <Input
              {...form.register("defenseDate")}
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.defenseDate && (
              <p className="text-sm text-red-600">{form.formState.errors.defenseDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local
            </label>
            <Input
              {...form.register("location")}
              placeholder="Sala 301 - Bloco A"
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.location && (
              <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Orientador
            </label>
            <select
              {...form.register("advisorId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={form.formState.isSubmitting}
            >
              <option value="">Selecione um orientador</option>
              {advisors.map((advisor) => (
                <option key={advisor.userId} value={advisor.userId}>
                  {advisor.name} - {advisor.email}
                </option>
              ))}
            </select>
            {form.formState.errors.advisorId && (
              <p className="text-sm text-red-600">{form.formState.errors.advisorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Estudantes
              </label>
              <span className="text-xs text-muted-foreground">
                {selectedStudents.length}/2 selecionados
              </span>
            </div>
            <div className="border rounded-md p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {students.length === 0 ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Nenhum estudante disponível</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false)
                      router.push("/students")
                    }}
                    className="cursor-pointer gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 h-auto py-1 px-2"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Adicionar
                  </Button>
                </div>
              ) : (
                students.map((student) => {
                  const isSelected = selectedStudents.includes(student.userId)
                  const isDisabled = !isSelected && selectedStudents.length >= 2

                  return (
                    <label
                      key={student.userId}
                      className={`flex items-center gap-2 p-2 rounded-md ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleStudentToggle(student.userId)}
                        disabled={form.formState.isSubmitting || isDisabled}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
            {form.formState.errors.studentIds && (
              <p className="text-sm text-red-600">{form.formState.errors.studentIds.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Banca Examinadora
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", email: "" })}
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Membro {index + 1}</p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={form.formState.isSubmitting}
                        className="cursor-pointer h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      {...form.register(`examBoard.${index}.name`)}
                      placeholder="Nome completo"
                      disabled={form.formState.isSubmitting}
                    />
                    {form.formState.errors.examBoard?.[index]?.name && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.examBoard[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Input
                      {...form.register(`examBoard.${index}.email`)}
                      type="email"
                      placeholder="email@example.com"
                      disabled={form.formState.isSubmitting}
                    />
                    {form.formState.errors.examBoard?.[index]?.email && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.examBoard[index]?.email?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
            >
              {form.formState.isSubmitting ? "Criando..." : "Criar Defesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
