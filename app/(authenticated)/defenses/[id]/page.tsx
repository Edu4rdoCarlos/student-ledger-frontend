"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { Separator } from "@/components/primitives/separator"
import { Calendar, Users, FileText, CheckCircle2, Clock, XCircle, Shield, Download, Hash, ChevronRight, Upload, X, CalendarClock, MoreVertical, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import type { Defense } from "@/lib/types/defense"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { defenseService } from "@/lib/services/defense-service"
import { documentService } from "@/lib/services/document-service"
import { toast } from "sonner"
import { useUser } from "@/lib/hooks/use-user-role"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog"
import { Textarea } from "@/components/primitives/textarea"
import { FinalizeDefenseDialog } from "@/components/layout/defenses/finalize-defense-dialog"

export default function DefenseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [defense, setDefense] = useState<Defense | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [selectedSignature, setSelectedSignature] = useState<{ docId: string; signature: any } | null>(null)
  const [justification, setJustification] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false)

  const canDownload = useMemo(() => {
    if (!user || !defense) return false

    if (user.role === "ADMIN" || user.role === "COORDINATOR") return true

    const isStudent = defense.students?.some(student => student.email === user.email)
    if (isStudent) return true

    const isAdvisor = defense.advisor?.email === user.email
    if (isAdvisor) return true

    const isExamBoardMember = defense.examBoard?.some(member => member.email === user.email)
    if (isExamBoardMember) return true

    return false
  }, [user, defense])

  useEffect(() => {
    const fetchDefense = async () => {
      try {
        setLoading(true)
        const data = await defenseService.getDefenseById(params.id as string)
        setDefense(data)
      } catch (error) {
        console.error("Erro ao buscar defesa:", error)
        toast.error("Erro ao carregar defesa")
        router.push("/defenses")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDefense()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando defesa...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!defense) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/defenses")}
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/defenses" className="hover:text-foreground transition-colors">
              Defesas
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Detalhes</span>
          </nav>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{defense.title}</h1>
          <div className="flex flex-wrap gap-2">
            {defense.status === "SCHEDULED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                <Clock className="h-3 w-3" />
                Agendada
              </span>
            )}
            {defense.status === "COMPLETED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Concluída
              </span>
            )}
            {defense.status === "CANCELED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Cancelada
              </span>
            )}
            {defense.result === "APPROVED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Aprovado
              </span>
            )}
            {defense.result === "FAILED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Reprovado
              </span>
            )}
          </div>
        </div>

        {(user?.role === "COORDINATOR" || user?.role === "ADMIN") && defense.status !== "CANCELED" && (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {defense.status === "SCHEDULED" && (
                  <>
                    <DropdownMenuItem onClick={() => setFinalizeModalOpen(true)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Finalizar Defesa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")} className="cursor-pointer">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Reagendar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar Defesa
                    </DropdownMenuItem>
                  </>
                )}

                {defense.status === "COMPLETED" && defense.documents && defense.documents.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Documentos
                      </p>
                    </div>
                    {defense.documents.map((doc, index) => {
                      const allApproved = doc.signatures?.every(sig => sig.status === "APPROVED")
                      const hasPendingApprovals = doc.signatures?.some(sig => sig.status === "PENDING")

                      return (
                        <div key={doc.id}>
                          {index > 0 && <DropdownMenuSeparator />}
                          <div className="px-2 py-1">
                            <p className="text-xs text-muted-foreground">Versão {doc.version}</p>
                          </div>
                          {allApproved && (
                            <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")} className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Nova Versão
                            </DropdownMenuItem>
                          )}
                          {hasPendingApprovals && (
                            <DropdownMenuItem onClick={() => toast.info("Funcionalidade em desenvolvimento")} className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Substituir Documento
                            </DropdownMenuItem>
                          )}
                        </div>
                      )
                    })}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Informações da Defesa</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Data e Hora</p>
                  <p className="font-medium">
                    {new Date(defense.defenseDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {defense.location && (
                  <div>
                    <p className="text-muted-foreground">Local</p>
                    <p className="font-medium">{defense.location}</p>
                  </div>
                )}
                {defense.finalGrade !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Nota Final</p>
                    <p className="font-medium">{defense.finalGrade}</p>
                  </div>
                )}
              </div>
            </div>

            {defense.advisor && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Orientador</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{defense.advisor.name}</p>
                  <p className="text-muted-foreground">{defense.advisor.email}</p>
                  {defense.advisor.specialization && (
                    <p className="text-muted-foreground text-xs">{defense.advisor.specialization}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {defense.students && defense.students.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Alunos</h3>
                </div>
                <div className="space-y-2">
                  {defense.students.map((student) => (
                    <div key={student.id} className="text-sm p-3 rounded-lg border bg-muted/50">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-xs">{student.email}</p>
                      <p className="text-muted-foreground text-xs">Matrícula: {student.registration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {defense.examBoard && defense.examBoard.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Banca Examinadora</h3>
                </div>
                <div className="space-y-2">
                  {defense.examBoard.map((member) => (
                    <div key={member.id} className="text-sm p-3 rounded-lg border bg-muted/50">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground text-xs">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {defense.documents && defense.documents.length > 0 && (
          <div>
            <Separator className="mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Documentos</h3>
            </div>
            <div className="space-y-4">
              {defense.documents.map((doc) => (
                <div key={doc.id} className="p-6 rounded-lg border bg-muted/50 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Versão {doc.version}</p>
                        {doc.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Criado em {new Date(doc.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={doc.status === "APPROVED" ? "secondary" : "default"}>
                      {doc.status === "APPROVED" ? "Aprovado" : doc.status === "PENDING" ? "Pendente" : "Inativo"}
                    </Badge>
                  </div>

                  {(doc.changeReason || doc.documentCid || doc.blockchainRegisteredAt) && (
                    <div className="space-y-2 pt-2 border-t">
                      {doc.changeReason && (
                        <div className="flex items-start gap-2">
                          <p className="text-xs font-medium text-muted-foreground min-w-fit">Motivo da mudança:</p>
                          <p className="text-xs text-muted-foreground">{doc.changeReason}</p>
                        </div>
                      )}
                      {doc.documentCid && (
                        <div className="flex items-start gap-2">
                          <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground">CID</p>
                            <p className="text-xs text-muted-foreground font-mono break-all">{doc.documentCid}</p>
                          </div>
                        </div>
                      )}
                      {doc.blockchainRegisteredAt && (
                        <div className="flex items-start gap-2">
                          <Shield className="h-3.5 w-3.5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Registrado no Ledger</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.blockchainRegisteredAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {doc.signatures && doc.signatures.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold mb-3">Assinaturas:</p>
                      <div className="grid gap-3">
                        {doc.signatures.map((signature, index) => {
                          const isCurrentUser = signature.email === user?.email
                          const canApprove = isCurrentUser && signature.status === "PENDING"

                          return (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                              {signature.status === "APPROVED" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                              ) : signature.status === "REJECTED" ? (
                                <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <p className="text-sm font-medium">
                                    {signature.role}
                                    {isCurrentUser && <span className="text-muted-foreground ml-1">(você)</span>}
                                  </p>
                                  <Badge variant={signature.status === "APPROVED" ? "secondary" : signature.status === "REJECTED" ? "destructive" : "default"} className="text-xs">
                                    {signature.status === "APPROVED" ? "Aprovado" : signature.status === "REJECTED" ? "Rejeitado" : "Pendente"}
                                  </Badge>
                                </div>
                                {signature.email && (
                                  <p className="text-xs text-muted-foreground">{signature.email}</p>
                                )}
                                {signature.timestamp && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(signature.timestamp).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                )}
                                {signature.justification && (
                                  <p className="text-xs text-muted-foreground italic mt-2 pl-3 border-l-2">
                                    "{signature.justification}"
                                  </p>
                                )}
                                {canApprove && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 w-full cursor-pointer"
                                    onClick={() => {
                                      setSelectedSignature({ docId: doc.id, signature })
                                      setApprovalModalOpen(true)
                                    }}
                                  >
                                    Avaliar Documento
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {canDownload && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={async () => {
                          try {
                            const blob = await documentService.downloadDocument(doc.id)
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${defense.title}-v${doc.version}.pdf`
                            document.body.appendChild(a)
                            a.click()
                            window.URL.revokeObjectURL(url)
                            document.body.removeChild(a)
                            toast.success('Download realizado com sucesso!')
                          } catch (error) {
                            console.error('Erro ao baixar documento:', error)
                            toast.error('Erro ao baixar documento', {
                              description: 'Não foi possível baixar o documento. Verifique se você tem permissão para acessá-lo.',
                            })
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Baixar Documento
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Documento</DialogTitle>
            <DialogDescription>
              Escolha se deseja aprovar ou reprovar o documento. Em caso de reprovação, informe o motivo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Justificativa (opcional para aprovação, obrigatória para reprovação)</label>
              <Textarea
                placeholder="Digite sua justificativa aqui..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setApprovalModalOpen(false)
                setJustification("")
                setSelectedSignature(null)
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!justification.trim()) {
                  toast.error("Justificativa obrigatória para reprovação")
                  return
                }
                setSubmitting(true)
                try {
                  // TODO: Implementar chamada à API para reprovar
                  toast.info("Funcionalidade em desenvolvimento")
                  setApprovalModalOpen(false)
                  setJustification("")
                  setSelectedSignature(null)
                } catch (error) {
                  toast.error("Erro ao reprovar documento")
                } finally {
                  setSubmitting(false)
                }
              }}
              disabled={submitting}
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Reprovar
            </Button>
            <Button
              onClick={async () => {
                setSubmitting(true)
                try {
                  // TODO: Implementar chamada à API para aprovar
                  toast.info("Funcionalidade em desenvolvimento")
                  setApprovalModalOpen(false)
                  setJustification("")
                  setSelectedSignature(null)
                } catch (error) {
                  toast.error("Erro ao aprovar documento")
                } finally {
                  setSubmitting(false)
                }
              }}
              disabled={submitting}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FinalizeDefenseDialog
        open={finalizeModalOpen}
        onOpenChange={setFinalizeModalOpen}
        defenseId={defense.id}
        onSuccess={async () => {
          const updatedDefense = await defenseService.getDefenseById(defense.id)
          setDefense(updatedDefense)
        }}
      />
    </DashboardLayout>
  )
}
