"use client"

import { Badge } from "@/components/primitives/badge"
import { Button } from "@/components/primitives/button"
import { Separator } from "@/components/primitives/separator"
import { Calendar, MapPin, Users, FileText, CheckCircle2, Clock, XCircle, Shield, Download, Hash } from "lucide-react"
import type { Defense, DefenseStatus, DefenseResult } from "@/lib/types/defense"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"

const statusConfig: Record<DefenseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SCHEDULED: { label: "Agendada", variant: "default" },
  COMPLETED: { label: "Concluída", variant: "secondary" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
}

const resultConfig: Record<DefenseResult, { label: string; icon: any; color: string }> = {
  PENDING: { label: "Pendente", icon: Clock, color: "text-yellow-600" },
  APPROVED: { label: "Aprovado", icon: CheckCircle2, color: "text-green-600" },
  FAILED: { label: "Reprovado", icon: XCircle, color: "text-red-600" },
}

interface DefenseDetailsModalProps {
  defense: Defense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  loading?: boolean
}

export function DefenseDetailsModal({ defense, open, onOpenChange, loading }: DefenseDetailsModalProps) {
  if (!defense && !loading) {
    return null
  }

  const ResultIcon = defense ? resultConfig[defense.result].icon : Clock

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            {/* Title and Status */}
            <div>
              <h3 className="text-xl font-semibold mb-3">{defense.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={statusConfig[defense.status].variant}>
                  {statusConfig[defense.status].label}
                </Badge>
                <Badge variant="outline" className={resultConfig[defense.result].color}>
                  <ResultIcon className="h-3 w-3 mr-1" />
                  {resultConfig[defense.result].label}
                </Badge>
                {defense.finalGrade && defense.finalGrade > 0 && (
                  <Badge variant="secondary">
                    Nota Final: {defense.finalGrade.toFixed(1)}
                  </Badge>
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
                    <div key={doc.id} className="p-4 rounded-lg border bg-muted/50">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium">
                              Versão {doc.version}
                            </p>
                            <Badge variant={doc.status === "APPROVED" ? "secondary" : "default"}>
                              {doc.status === "APPROVED" ? "Aprovado" : doc.status === "PENDING" ? "Pendente" : "Inativo"}
                            </Badge>
                          </div>
                          {doc.changeReason && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Motivo da mudança: {doc.changeReason}
                            </p>
                          )}
                          {doc.documentCid && (
                            <div className="flex items-start gap-2 mb-2">
                              <Hash className="h-3 w-3 text-muted-foreground mt-0.5" />
                              <p className="text-xs text-muted-foreground font-mono break-all">
                                CID: {doc.documentCid}
                              </p>
                            </div>
                          )}
                          {doc.blockchainRegisteredAt && (
                            <p className="text-xs text-muted-foreground">
                              Registrado no Ledger em {new Date(doc.blockchainRegisteredAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Signatures */}
                      {doc.signatures && doc.signatures.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Assinaturas:</p>
                          <div className="space-y-2">
                            {doc.signatures.map((signature, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 rounded bg-background/50">
                                {signature.status === "APPROVED" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                ) : signature.status === "REJECTED" ? (
                                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium">{signature.role}</p>
                                    <Badge variant={signature.status === "APPROVED" ? "secondary" : signature.status === "REJECTED" ? "destructive" : "default"} className="text-xs">
                                      {signature.status === "APPROVED" ? "Aprovado" : signature.status === "REJECTED" ? "Rejeitado" : "Pendente"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{signature.email}</p>
                                  {signature.timestamp && (
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(signature.timestamp).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  )}
                                  {signature.justification && (
                                    <p className="text-xs text-muted-foreground italic mt-1">
                                      "{signature.justification}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {doc.downloadUrl && (
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                          <a href={doc.downloadUrl} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
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
