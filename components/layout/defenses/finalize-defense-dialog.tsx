"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { CheckCircle2, FileText, X, Upload } from "lucide-react"
import { toast } from "sonner"
import { defenseService } from "@/lib/services/defense-service"
import { PDFDocument } from "pdf-lib"

interface FinalizeDefenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defenseId: string
  onSuccess?: () => void
}

export function FinalizeDefenseDialog({ open, onOpenChange, defenseId, onSuccess }: FinalizeDefenseDialogProps) {
  const [finalGrade, setFinalGrade] = useState("")
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    if (!submitting) {
      setFinalGrade("")
      setDocumentFiles([])
      onOpenChange(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => {
      if (file.type !== "application/pdf") {
        toast.error("Formato inválido", {
          description: `O arquivo "${file.name}" não é um PDF.`,
        })
        return false
      }
      return true
    })

    setDocumentFiles(prev => [...prev, ...newFiles])
    e.target.value = ""
  }

  const handleRemoveFile = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index))
  }

  const mergePDFs = async (files: File[]): Promise<File> => {
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach(page => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    return new File([new Uint8Array(mergedPdfBytes).buffer], "documento-final.pdf", { type: "application/pdf" })
  }

  const handleSubmit = async () => {
    const grade = parseFloat(finalGrade)
    if (isNaN(grade) || grade < 0 || grade > 10) {
      toast.error("Nota inválida", {
        description: "A nota deve ser um número entre 0 e 10.",
      })
      return
    }
    if (documentFiles.length === 0) {
      toast.error("Documento obrigatório", {
        description: "Selecione pelo menos um documento para a defesa.",
      })
      return
    }

    setSubmitting(true)
    try {
      let finalDocument: File
      if (documentFiles.length === 1) {
        finalDocument = documentFiles[0]
      } else {
        finalDocument = await mergePDFs(documentFiles)
      }

      await defenseService.submitResult(defenseId, grade, finalDocument)
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
            <Label htmlFor="document">Documentos (PDFs)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="document"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={submitting}
              />
            </div>
            {documentFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  {documentFiles.length} arquivo(s) selecionado(s)
                  {documentFiles.length > 1 && " - serão mesclados em um único PDF"}
                </p>
                <div className="space-y-1">
                  {documentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={() => handleRemoveFile(index)}
                        disabled={submitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
            disabled={submitting || !finalGrade || documentFiles.length === 0}
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
