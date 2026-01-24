"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { FileText, User, GraduationCap, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Mail } from "lucide-react"
import { Badge } from "@/components/primitives/badge"
import { Button } from "@/components/primitives/button"
import { useUserRole } from "@/lib/hooks/use-user-role"
import { toast } from "sonner"
import { approvalService } from "@/lib/services/approval-service"
import type { PendingApproval } from "@/hooks/use-approvals"
import { useState } from "react"

interface ApprovalDetailsModalProps {
  approval: PendingApproval | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApprovalDetailsModal({ approval, open, onOpenChange }: ApprovalDetailsModalProps) {
  const { isCoordinator } = useUserRole()
  const [sendingEmail, setSendingEmail] = useState(false)

  if (!approval) return null

  const handleSendEmail = async (signature: any) => {
    setSendingEmail(true)
    try {
      await approvalService.notifyApprover(signature.id)
      toast.success("E-mail enviado com sucesso!", {
        description: `Notificação enviada para ${signature.approverName}`,
      })
    } catch (error) {
      console.error("Erro ao notificar aprovador:", error)
      toast.error("Erro ao enviar e-mail", {
        description: "Não foi possível enviar a notificação. Tente novamente.",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Aprovado"
      case "REJECTED":
        return "Rejeitado"
      case "PENDING":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  const getRoleText = (role: string, isCoordinatorAlsoAdvisor?: boolean) => {
    switch (role) {
      case "ADVISOR":
        return "Orientador"
      case "COORDINATOR":
        return isCoordinatorAlsoAdvisor ? "Coordenador e Orientador" : "Coordenador"
      case "ADMIN":
        return "Administrador"
      case "STUDENT":
        return "Aluno"
      default:
        return role
    }
  }

  const signatures = approval.signatures || approval.approvals || []

  const coordinatorSignature = signatures.find((s) => s.role === "COORDINATOR")
  const advisorSignature = signatures.find((s) => s.role === "ADVISOR")
  const isCoordinatorAlsoAdvisor =
    coordinatorSignature?.approverId &&
    advisorSignature?.approverId &&
    coordinatorSignature.approverId === advisorSignature.approverId

  const displaySignatures = isCoordinatorAlsoAdvisor
    ? signatures.filter((s) => s.role !== "ADVISOR")
    : signatures
  const approvedCount = signatures.filter((s) => s.status === "APPROVED").length
  const totalSignatures = signatures.length
  const progressPercentage = (approvedCount / totalSignatures) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl min-h-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <FileText className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="line-clamp-2">{approval.documentTitle}</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Aguardando sua aprovação
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6 overflow-y-auto flex-1 pr-2">
          {/* Informações Gerais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Documento</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Curso</label>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{approval.courseName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{formatDate(approval.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Alunos */}
          {approval.students.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alunos</h3>
              <div className="space-y-2">
                {approval.students.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Matrícula: {student.registration}</p>
                      {student.email && (
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progresso de Assinaturas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Progresso de Aprovações</h3>
              <span className="text-sm font-medium text-muted-foreground">
                {approvedCount} de {totalSignatures} aprovações
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lista de Assinaturas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assinaturas</h3>
            <div className="space-y-3">
              {displaySignatures.map((signature, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between p-4 rounded-lg border transition-colors ${
                    signature.status === "APPROVED"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                      : signature.status === "REJECTED"
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getStatusIcon(signature.status)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{signature.approverName}</p>
                        <Badge variant="outline" className="text-xs">
                          {getRoleText(signature.role, !!(isCoordinatorAlsoAdvisor && signature.role === "COORDINATOR"))}
                        </Badge>
                      </div>
                      {signature.approvedAt && (
                        <p className="text-xs text-muted-foreground">
                          {getStatusText(signature.status)} em {formatDate(signature.approvedAt)}
                        </p>
                      )}
                      {signature.justification && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Justificativa:</span> {signature.justification}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCoordinator && signature.status === "PENDING" && signature.role !== "COORDINATOR" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendEmail(signature)}
                        disabled={sendingEmail}
                        className="gap-1.5 h-7 px-2.5 text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {sendingEmail ? "Notificando..." : "Notificar"}
                      </Button>
                    )}
                    <Badge
                      className={
                        signature.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : signature.status === "REJECTED"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }
                    >
                      {getStatusText(signature.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
