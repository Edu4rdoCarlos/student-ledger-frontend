"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Textarea } from "@/components/primitives/textarea"
import { defenseService } from "@/lib/services/defense-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import type { Defense } from "@/lib/types"

const rescheduleDefenseSchema = z.object({
  defenseDate: z.string().min(1, "Data da defesa é obrigatória"),
  rescheduleReason: z.string().min(10, "O motivo deve ter pelo menos 10 caracteres"),
})

type RescheduleDefenseFormData = z.infer<typeof rescheduleDefenseSchema>

interface RescheduleDefenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  defense: Defense | null
}

export function RescheduleDefenseModal({ open, onOpenChange, onSuccess, defense }: RescheduleDefenseModalProps) {
  const form = useForm<RescheduleDefenseFormData>({
    resolver: zodResolver(rescheduleDefenseSchema),
    defaultValues: {
      defenseDate: "",
      rescheduleReason: "",
    },
  })

  const onSubmit = async (data: RescheduleDefenseFormData) => {
    if (!defense) return

    try {
      // Converte a data do datetime-local para ISO 8601
      const localDate = new Date(data.defenseDate)
      const isoDate = localDate.toISOString()

      await defenseService.rescheduleDefense(defense.id, {
        defenseDate: isoDate,
        rescheduleReason: data.rescheduleReason,
      })

      toast.success("Defesa reagendada com sucesso!")
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao reagendar defesa:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error("Erro ao reagendar defesa", {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>Reagendar Defesa</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Altere a data e informe o motivo
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Nova Data e Hora
            </label>
            <Input
              {...form.register("defenseDate")}
              type="datetime-local"
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.defenseDate && (
              <p className="text-sm text-red-600">{form.formState.errors.defenseDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Motivo do Reagendamento
            </label>
            <Textarea
              {...form.register("rescheduleReason")}
              placeholder="Ex: Conflito de horário com outro evento acadêmico"
              rows={4}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.rescheduleReason && (
              <p className="text-sm text-red-600">{form.formState.errors.rescheduleReason.message}</p>
            )}
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
              {form.formState.isSubmitting ? "Reagendando..." : "Reagendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
