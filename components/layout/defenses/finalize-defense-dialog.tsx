"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { CheckCircle2, FileText, X, Upload } from "lucide-react"
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
  const [minutesFile, setMinutesFile] = useState<File | null>(null)
  const [evaluationFile, setEvaluationFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDraggingMinutes, setIsDraggingMinutes] = useState(false)
  const [isDraggingEvaluation, setIsDraggingEvaluation] = useState(false)

  const handleClose = () => {
    if (!submitting) {
      setFinalGrade("")
      setMinutesFile(null)
      setEvaluationFile(null)
      onOpenChange(false)
    }
  }

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      toast.error("Formato inválido", {
        description: `O arquivo "${file.name}" não é um PDF.`,
      })
      return false
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: `O arquivo "${file.name}" excede 10MB.`,
      })
      return false
    }
    return true
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setMinutesFile(file)
    }
    e.target.value = ""
  }

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setEvaluationFile(file)
    }
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: "minutes" | "evaluation") => {
    e.preventDefault()
    type === "minutes" ? setIsDraggingMinutes(false) : setIsDraggingEvaluation(false)

    const file = e.dataTransfer.files?.[0]
    if (file && validateFile(file)) {
      type === "minutes" ? setMinutesFile(file) : setEvaluationFile(file)
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
    if (!minutesFile || !evaluationFile) {
      toast.error("Documentos obrigatórios", {
        description: "Selecione a Ata e a Avaliação de Desempenho.",
      })
      return
    }

    setSubmitting(true)
    try {
      await defenseService.submitResult(defenseId, grade, minutesFile, evaluationFile)
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
            Insira a nota final e faça upload dos documentos da defesa.
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
            <Label>Documentos Obrigatórios</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ata */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Ata <span className="text-red-500">*</span></p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingMinutes(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingMinutes(false) }}
                  onDrop={(e) => handleDrop(e, "minutes")}
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isDraggingMinutes
                      ? "border-primary bg-primary/5"
                      : minutesFile
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleMinutesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={submitting}
                  />
                  {minutesFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-6 w-6 text-green-600" />
                      <p className="text-xs font-medium truncate max-w-full px-2">{minutesFile.name}</p>
                      <p className={`text-xs ${minutesFile.size > 8 * 1024 * 1024 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        ({(minutesFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs mt-1"
                        onClick={(e) => { e.stopPropagation(); setMinutesFile(null) }}
                        disabled={submitting}
                      >
                        <X className="h-3 w-3 mr-1" /> Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Clique ou arraste</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Avaliação de Desempenho */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Avaliação de Desempenho <span className="text-red-500">*</span></p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingEvaluation(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingEvaluation(false) }}
                  onDrop={(e) => handleDrop(e, "evaluation")}
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    isDraggingEvaluation
                      ? "border-primary bg-primary/5"
                      : evaluationFile
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleEvaluationChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={submitting}
                  />
                  {evaluationFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-6 w-6 text-green-600" />
                      <p className="text-xs font-medium truncate max-w-full px-2">{evaluationFile.name}</p>
                      <p className={`text-xs ${evaluationFile.size > 8 * 1024 * 1024 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        ({(evaluationFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs mt-1"
                        onClick={(e) => { e.stopPropagation(); setEvaluationFile(null) }}
                        disabled={submitting}
                      >
                        <X className="h-3 w-3 mr-1" /> Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Clique ou arraste</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Formato aceito: PDF (máximo 10MB por arquivo)
            </p>
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
            disabled={submitting || !finalGrade || !minutesFile || !evaluationFile}
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
