"use client"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Textarea } from "@/components/primitives/textarea"
import { Input } from "@/components/primitives/input"
import { toast } from "sonner"
import { documentRepository } from "@/lib/repositories/document-repository"
import { PDFDocument } from "pdf-lib"

interface NewVersionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentTitle: string
  approvalId: string
  rejectionReason?: string
  approverName?: string
  onSuccess?: () => void
}

export function NewVersionModal({
  open,
  onOpenChange,
  documentTitle,
  approvalId,
  rejectionReason,
  approverName,
  onSuccess,
}: NewVersionModalProps) {
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [reason, setReason] = useState("")
  const [finalGrade, setFinalGrade] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File) => {
    // Validar tipo de arquivo (apenas PDFs)
    if (file.type !== "application/pdf") {
      toast.error("Formato de arquivo inválido", {
        description: `O arquivo "${file.name}" não é um PDF.`,
      })
      return false
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: `O arquivo "${file.name}" excede 10MB.`,
      })
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => validateFile(file))
    setDocumentFiles(prev => [...prev, ...newFiles])
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => validateFile(file))
    setDocumentFiles(prev => [...prev, ...newFiles])
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
    return new File([new Uint8Array(mergedPdfBytes).buffer], "documento-nova-versao.pdf", { type: "application/pdf" })
  }

  const handleSubmit = async () => {
    if (documentFiles.length === 0) {
      toast.error("Documento não selecionado", {
        description: "Por favor, selecione pelo menos um documento para enviar.",
      })
      return
    }

    if (!reason.trim()) {
      toast.error("Motivo não informado", {
        description: "Por favor, informe o motivo da nova versão.",
      })
      return
    }

    let grade: number | undefined
    if (finalGrade) {
      grade = parseFloat(finalGrade)
      if (isNaN(grade) || grade < 0 || grade > 10) {
        toast.error("Nota inválida", {
          description: "Por favor, informe uma nota válida entre 0 e 10.",
        })
        return
      }
    }

    setSubmitting(true)
    try {
      let finalDocument: File
      if (documentFiles.length === 1) {
        finalDocument = documentFiles[0]
      } else {
        finalDocument = await mergePDFs(documentFiles)
      }

      await documentRepository.uploadNewVersion(approvalId, finalDocument, reason, grade)

      toast.success("Nova versão enviada!", {
        description: "O documento foi enviado e será reavaliado.",
      })

      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao enviar nova versão:", error)
      toast.error("Erro ao enviar nova versão", {
        description: "Não foi possível processar sua solicitação. Tente novamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setDocumentFiles([])
    setReason("")
    setFinalGrade("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar Nova Versão do Documento</DialogTitle>
          <DialogDescription>
            Envie uma versão atualizada do documento para reavaliação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Documento Original</label>
            <p className="text-sm text-muted-foreground">{documentTitle}</p>
          </div>

          {rejectionReason && approverName && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejeitado por</label>
                <p className="text-sm font-medium">{approverName}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Motivo da rejeição</label>
                <p className="text-sm text-muted-foreground italic border-l-2 border-red-400 pl-3 py-2 bg-red-50 dark:bg-red-950/20 rounded">
                  "{rejectionReason}"
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Novo Documento <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Clique para fazer upload</p>
                  <p className="text-xs text-muted-foreground">PDF (múltiplos arquivos permitidos)</p>
                </div>
              </div>
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
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Formato aceito: PDF (máximo 10MB por arquivo)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Motivo da Nova Versão <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Explique as mudanças realizadas nesta nova versão do documento..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Descreva as alterações feitas para atender às solicitações do avaliador.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nota Final <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Input
              type="number"
              placeholder="Digite a nota (0 a 10)"
              value={finalGrade}
              onChange={(e) => setFinalGrade(e.target.value)}
              min={0}
              max={10}
              step={0.1}
            />
            <p className="text-xs text-muted-foreground">
              Informe a nota final do trabalho (0 a 10).
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || documentFiles.length === 0 || !reason.trim()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {submitting ? "Enviando..." : "Enviar Nova Versão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
