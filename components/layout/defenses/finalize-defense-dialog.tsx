"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { CheckCircle2, FileText } from "lucide-react"
import { toast } from "sonner"
import { defenseService } from "@/lib/services/defense-service"

interface FinalizeDefenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defenseId: string
  onSuccess?: () => void
}

export function FinalizeDefenseDialog({ open, onOpenChange, defenseId, onSuccess }: FinalizeDefenseDialogProps) {
  const [finalGrade, setFinalGrade] = useState("")
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    if (!submitting) {
      setFinalGrade("")
      setDocumentFile(null)
      onOpenChange(false)
    }
  }

  const handleSubmit = async () => {
    const grade = parseFloat(finalGrade)
    if (isNaN(grade) || grade < 0 || grade > 10) {
      toast.error("Nota inválida", {
        description: "A nota deve ser um número entre 0 e 10.",
      })
      return
    }
    if (!documentFile) {
      toast.error("Documento obrigatório", {
        description: "Selecione o documento final da defesa.",
      })
      return
    }

    setSubmitting(true)
    try {
      await defenseService.submitResult(defenseId, grade, documentFile)
      toast.success("Defesa finalizada com sucesso!")
      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao finalizar defesa:", error)
      toast.error("Erro ao finalizar defesa", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Finalizar Defesa
          </DialogTitle>
          <DialogDescription>
            Insira a nota final e faça upload do documento unificado da defesa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="finalGrade">Nota Final (0 a 10)</Label>
            <Input
              id="finalGrade"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="Ex: 8.5"
              value={finalGrade}
              onChange={(e) => setFinalGrade(e.target.value)}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Notas {">="} 7 são aprovadas, {"<"} 7 são reprovadas.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Documento Final</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf"
              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
              disabled={submitting}
            />
            {documentFile && (
              <p className="text-xs text-muted-foreground">
                Arquivo selecionado: {documentFile.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !finalGrade || !documentFile}
            className="gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Finalizar Defesa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
