"use client"

import { useState } from "react"
import { Download, CheckCircle, XCircle, FileText, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Textarea } from "@/components/primitives/textarea"
import { toast } from "sonner"
import { approvalService } from "@/lib/services/approval-service"
import { documentRepository } from "@/lib/repositories/document-repository"

interface EvaluateDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentId: string
  documentTitle: string
  students: Array<{
    name: string
    email: string
    registration: string
  }>
  courseName: string
  approvalId: string
  onSuccess?: () => void
}

export function EvaluateDocumentModal({
  open,
  onOpenChange,
  documentId,
  documentTitle,
  students,
  courseName,
  approvalId,
  onSuccess,
}: EvaluateDocumentModalProps) {
  const [justification, setJustification] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await documentRepository.download(documentId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${documentTitle}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Download concluído!", {
        description: "O documento foi baixado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao baixar documento:", error)
      toast.error("Erro ao baixar documento", {
        description: "Não foi possível baixar o documento. Tente novamente.",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleApprove = async () => {
    setSubmitting(true)
    try {
      await approvalService.approveDocument(approvalId, justification)

      toast.success("Documento aprovado!", {
        description: "Sua aprovação foi registrada com sucesso.",
      })

      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao aprovar documento:", error)
      toast.error("Erro ao aprovar documento", {
        description: "Não foi possível registrar sua aprovação. Tente novamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!justification.trim()) {
      toast.error("Justificativa obrigatória", {
        description: "Por favor, informe o motivo da rejeição.",
      })
      return
    }

    setSubmitting(true)
    try {
      await approvalService.rejectDocument(approvalId, justification)

      toast.success("Documento rejeitado", {
        description: "Sua rejeição foi registrada com sucesso.",
      })

      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao rejeitar documento:", error)
      toast.error("Erro ao rejeitar documento", {
        description: "Não foi possível registrar sua rejeição. Tente novamente.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setJustification("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Avaliar Documento</DialogTitle>
          <DialogDescription>
            Analise o documento e forneça sua avaliação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Documento</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{documentTitle}</p>
                <p className="text-xs text-muted-foreground">{courseName}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
                className="flex-shrink-0 gap-2"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Baixando..." : "Baixar"}
              </Button>
            </div>
          </div>

          {students.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Estudante(s)</label>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.registration}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{student.registration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Justificativa / Comentários
              <span className="text-muted-foreground text-xs ml-1">(opcional para aprovação, obrigatório para rejeição)</span>
            </label>
            <Textarea
              placeholder="Adicione comentários sobre sua avaliação..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Seus comentários serão visíveis para os estudantes e outros avaliadores.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={submitting}
              className="flex-1 sm:flex-initial gap-2"
            >
              <XCircle className="h-4 w-4" />
              {submitting ? "Rejeitando..." : "Rejeitar"}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submitting}
              className="flex-1 sm:flex-initial gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {submitting ? "Aprovando..." : "Aprovar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
