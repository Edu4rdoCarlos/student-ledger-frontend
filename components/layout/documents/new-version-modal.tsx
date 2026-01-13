"use client"

import { useState } from "react"
import { Upload, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Textarea } from "@/components/primitives/textarea"
import { toast } from "sonner"
import { documentRepository } from "@/lib/repositories/document-repository"

interface NewVersionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentTitle: string
  approvalId: string
  rejectionReason: string
  approverName: string
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
  const [document, setDocument] = useState<File | null>(null)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File) => {
    // Validar tipo de arquivo (apenas PDFs)
    if (file.type !== "application/pdf") {
      toast.error("Formato de arquivo inválido", {
        description: "Apenas arquivos PDF são aceitos.",
      })
      return false
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "O arquivo não pode exceder 10MB.",
      })
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      setDocument(file)
    }
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

    const file = e.dataTransfer.files?.[0]
    if (file && validateFile(file)) {
      setDocument(file)
    }
  }

  const handleRemoveFile = () => {
    setDocument(null)
  }

  const handleSubmit = async () => {
    if (!document) {
      toast.error("Documento não selecionado", {
        description: "Por favor, selecione um documento para enviar.",
      })
      return
    }

    if (!reason.trim()) {
      toast.error("Motivo não informado", {
        description: "Por favor, informe o motivo da nova versão.",
      })
      return
    }

    setSubmitting(true)
    try {
      await documentRepository.uploadNewVersion(approvalId, document, reason)

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
    setDocument(null)
    setReason("")
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Novo Documento <span className="text-red-500">*</span>
            </label>
            {!document ? (
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
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                  </div>
                  <div className="flex items-center gap-2 w-full max-w-xs">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">OU</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border">
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(document.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0"
                >
                  Remover
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Formato aceito: PDF (máximo 10MB)
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
            disabled={submitting || !document || !reason.trim()}
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
