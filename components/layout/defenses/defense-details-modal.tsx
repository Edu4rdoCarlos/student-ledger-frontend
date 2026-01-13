"use client"

import { Badge } from "@/components/primitives/badge"
import { Button } from "@/components/primitives/button"
import { Separator } from "@/components/primitives/separator"
import { Calendar, MapPin, Users, FileText, CheckCircle2, Clock, XCircle, Shield, Download, Hash } from "lucide-react"
import type { Defense } from "@/lib/types/defense"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { documentService } from "@/lib/services/document-service"
import { toast } from "sonner"
import { useUser } from "@/lib/hooks/use-user-role"
import { useMemo } from "react"

interface DefenseDetailsModalProps {
  defense: Defense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
}

export function DefenseDetailsModal({ defense, open, onOpenChange, loading }: DefenseDetailsModalProps) {
  const { user } = useUser()

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

  if (!defense && !loading) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes da Defesa</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando detalhes...</p>
            </div>
          </div>
        ) : defense ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">{defense.title}</h3>
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
                {defense.finalGrade && defense.finalGrade > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                    Nota Final: {defense.finalGrade.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Defense Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data da Defesa</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(defense.defenseDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {defense.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Local</p>
                      <p className="text-sm text-muted-foreground">{defense.location}</p>
                    </div>
                  </div>
                )}

                {defense.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Criado em</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(defense.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {defense.updatedAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Última atualização</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(defense.updatedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {defense.advisor && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Orientador</p>
                      <p className="text-sm text-muted-foreground">{defense.advisor.name}</p>
                      <p className="text-xs text-muted-foreground">{defense.advisor.email}</p>
                      {defense.advisor.specialization && (
                        <p className="text-xs text-muted-foreground">{defense.advisor.specialization}</p>
                      )}
                      <Badge variant={defense.advisor.isActive ? "secondary" : "destructive"} className="mt-1">
                        {defense.advisor.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Students */}
            {defense.students && defense.students.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Estudantes</h4>
                </div>
                <div className="grid gap-3">
                  {defense.students.map((student) => (
                    <div key={student.id} className="p-3 rounded-lg bg-muted/50 border">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground">Matrícula: {student.registration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Board */}
            {defense.examBoard && defense.examBoard.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Banca Examinadora</h4>
                </div>
                <div className="grid gap-3">
                  {defense.examBoard.map((member) => (
                    <div key={member.id} className="p-3 rounded-lg bg-muted/50 border">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Documents */}
            {defense.documents && defense.documents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold">Documentos</h4>
                </div>
                <div className="space-y-4">
                  {defense.documents.map((doc) => (
                    <div key={doc.id} className="p-6 rounded-lg border bg-muted/50 space-y-4">
                      {/* Header */}
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

                      {/* Additional Info */}
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

                      {/* Signatures */}
                      {doc.signatures && doc.signatures.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-semibold mb-3">Assinaturas:</p>
                          <div className="grid gap-3">
                            {doc.signatures.map((signature, index) => (
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
                                    <p className="text-sm font-medium">{signature.role}</p>
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
                                </div>
                              </div>
                            ))}
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
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
