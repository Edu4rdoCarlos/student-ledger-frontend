"use client"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Textarea } from "@/components/primitives/textarea"
import { Input } from "@/components/primitives/input"
import { Label } from "@/components/primitives/label"
import { toast } from "sonner"
import { documentRepository } from "@/lib/repositories/document-repository"
import type { ValidatedDocumentType } from "@/lib/types"

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
  const [documentType, setDocumentType] = useState<ValidatedDocumentType>("minutes")
  const [file, setFile] = useState<File | null>(null)
  const [reason, setReason] = useState("")
  const [finalGrade, setFinalGrade] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      toast.error("Formato de arquivo inválido", {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
    }
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Documento obrigatório", {
        description: "Por favor, selecione o documento para enviar.",
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
      await documentRepository.uploadNewVersion(approvalId, file, documentType, reason, grade)

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
    setDocumentType("minutes")
    setFile(null)
    setReason("")
    setFinalGrade("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
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
                  &ldquo;{rejectionReason}&rdquo;
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Tipo de Documento <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={documentType === "minutes" ? "default" : "outline"}
                className="w-full"
                onClick={() => { setDocumentType("minutes"); setFile(null); setReason(""); setFinalGrade("") }}
                disabled={submitting}
              >
                Ata
              </Button>
              <Button
                type="button"
                variant={documentType === "evaluation" ? "default" : "outline"}
                className="w-full"
                onClick={() => { setDocumentType("evaluation"); setFile(null); setReason(""); setFinalGrade("") }}
                disabled={submitting}
              >
                Avaliação de Desempenho
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecione qual documento você deseja substituir.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Novo Documento <span className="text-red-500">*</span>
            </Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={submitting}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2 w-full overflow-hidden">
                  <FileText className="h-8 w-8 text-green-600 shrink-0" />
                  <p className="text-sm font-medium text-center px-2">
                    {file.name.length > 30
                      ? `${file.name.slice(0, 15)}...${file.name.slice(-12)}`
                      : file.name}
                  </p>
                  <p className={`text-xs ${file.size > 8 * 1024 * 1024 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs mt-1"
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    disabled={submitting}
                  >
                    <X className="h-3 w-3 mr-1" /> Remover
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">ou arraste o arquivo aqui</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Formato aceito: PDF (máximo 10MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Motivo da Nova Versão <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Explique as mudanças realizadas nesta nova versão do documento..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Descreva as alterações feitas para atender às solicitações do avaliador.
            </p>
          </div>

          {documentType === "evaluation" && (
            <div className="space-y-2">
              <Label>
                Nota Final <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                type="number"
                placeholder="Digite a nota (0 a 10)"
                value={finalGrade}
                onChange={(e) => setFinalGrade(e.target.value)}
                min={0}
                max={10}
                step={0.1}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Informe a nota final do trabalho (0 a 10).
              </p>
            </div>
          )}
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
            disabled={submitting || !file || !reason.trim()}
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
