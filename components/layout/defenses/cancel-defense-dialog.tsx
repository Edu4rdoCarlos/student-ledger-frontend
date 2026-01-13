"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Textarea } from "@/components/primitives/textarea"
import { defenseService } from "@/lib/services/defense-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const cancelDefenseSchema = z.object({
  cancellationReason: z.string().min(10, "O motivo deve ter pelo menos 10 caracteres"),
})

type CancelDefenseFormData = z.infer<typeof cancelDefenseSchema>

interface CancelDefenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  defenseId: string
}

export function CancelDefenseDialog({ open, onOpenChange, onSuccess, defenseId }: CancelDefenseDialogProps) {
  const form = useForm<CancelDefenseFormData>({
    resolver: zodResolver(cancelDefenseSchema),
    defaultValues: {
      cancellationReason: "",
    },
  })

  const onSubmit = async (data: CancelDefenseFormData) => {
    try {
      await defenseService.cancelDefense(defenseId, {
        cancellationReason: data.cancellationReason,
      })

      toast.success("Defesa cancelada com sucesso!")
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao cancelar defesa:", error)
      const errorMessage = error?.message || "Erro desconhecido"
      toast.error("Erro ao cancelar defesa", {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <p>Cancelar Defesa</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="pt-4 space-y-2">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Atenção: Consequências do cancelamento
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>O aluno será reprovado automaticamente</li>
                  <li>Os dados não serão registrados no Hyperledger</li>
                  <li>Esta ação é irreversível</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Motivo do Cancelamento
            </label>
            <Textarea
              {...form.register("cancellationReason")}
              placeholder="Ex: Estudante solicitou trancamento de matrícula"
              rows={4}
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.cancellationReason && (
              <p className="text-sm text-red-600">{form.formState.errors.cancellationReason.message}</p>
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
              Voltar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer gap-2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Cancelando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Confirmar Cancelamento
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
