"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/primitives/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { Badge } from "@/components/primitives/badge"
import { Calendar, MapPin, Users, FileText, Download, CheckCircle2, Clock, XCircle, Shield, AlertCircle } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user-role"
import { isStudent } from "@/lib/types"
import type { Defense, DefenseStatus, DefenseResult, DocumentStatus, DefenseDocument } from "@/lib/types/defense"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const statusConfig: Record<DefenseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SCHEDULED: { label: "Agendada", variant: "default" },
  COMPLETED: { label: "Concluída", variant: "secondary" },
  CANCELLED: { label: "Cancelada", variant: "destructive" },
}

const resultConfig: Record<DefenseResult, { label: string; icon: any; color: string }> = {
  PENDING: { label: "Pendente", icon: Clock, color: "text-yellow-600" },
  APPROVED: { label: "Aprovado", icon: CheckCircle2, color: "text-green-600" },
  FAILED: { label: "Reprovado", icon: XCircle, color: "text-red-600" },
}

const documentStatusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  PENDING: { label: "Aguardando Aprovação", variant: "default", color: "text-yellow-600" },
  APPROVED: { label: "Aprovado", variant: "secondary", color: "text-green-600" },
  INACTIVE: { label: "Inativo", variant: "destructive", color: "text-gray-600" },
}

export default function DefensesPage() {
  const { user } = useUser()
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [loading, setLoading] = useState(true)
  const [validatingDoc, setValidatingDoc] = useState<string | null>(null)

  useEffect(() => {
    if (user && isStudent(user)) {
      setDefenses(user.metadata.student.defenses || [])
      setLoading(false)
    }
  }, [user])

  const handleApproveDocument = async (doc: DefenseDocument) => {
    try {
      setValidatingDoc(doc.id)

      console.log("Aprovando documento:", doc.id)
      await new Promise(resolve => setTimeout(resolve, 1500))

      setDefenses(prev => prev.map(defense => ({
        ...defense,
        documents: defense.documents.map(d =>
          d.id === doc.id
            ? {
                ...d,
                approvals: d.approvals?.map(approval =>
                  approval.role === "STUDENT"
                    ? { ...approval, status: "APPROVED" as const, approvedAt: new Date().toISOString() }
                    : approval
                )
              }
            : d
        )
      })))

    } catch (error) {
      console.error("Erro ao aprovar documento:", error)
    } finally {
      setValidatingDoc(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando defesas...</p>
        </div>
      </div>
    )
  }

  if (!user || !isStudent(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para visualizar esta página.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Minhas Defesas</h1>
          <p className="text-muted-foreground">
            Acompanhe suas defesas de TCC e visualize os documentos relacionados
          </p>
        </div>

      {defenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma defesa encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Você ainda não possui defesas agendadas. Aguarde o coordenador agendar sua defesa.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {defenses.map((defense) => {
            const ResultIcon = resultConfig[defense.result].icon
            return (
              <Card key={defense.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{defense.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={statusConfig[defense.status].variant}>
                          {statusConfig[defense.status].label}
                        </Badge>
                        <Badge variant="outline" className={resultConfig[defense.result].color}>
                          <ResultIcon className="h-3 w-3 mr-1" />
                          {resultConfig[defense.result].label}
                        </Badge>
                        {defense.finalGrade > 0 && (
                          <Badge variant="secondary">
                            Nota: {defense.finalGrade.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Local</p>
                        <p className="text-sm text-muted-foreground">{defense.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Orientador</p>
                        <p className="text-sm text-muted-foreground">{defense.advisor.name}</p>
                        <p className="text-xs text-muted-foreground">{defense.advisor.specialization}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Banca Examinadora</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {defense.examBoard.map((member) => (
                            <p key={member.id}>{member.name}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {defense.documents && defense.documents.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Documentos</h4>
                      </div>
                      <div className="grid gap-3">
                        {defense.documents.map((doc) => {
                          const studentApproval = doc.approvals?.find(a => a.role === "STUDENT")
                          const needsStudentApproval = studentApproval?.status === "PENDING"
                          const isApproving = validatingDoc === doc.id
                          const statusInfo = documentStatusConfig[doc.status]
                          const isRegisteredOnBlockchain = !!doc.blockchainTxId

                          return (
                            <div
                              key={doc.id}
                              className={`p-4 rounded-lg border ${
                                needsStudentApproval
                                  ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
                                  : "bg-muted/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-medium">
                                      {doc.type} - Versão {doc.version}
                                    </p>
                                    <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive" | "outline" | undefined}>
                                      {statusInfo.label}
                                    </Badge>
                                    {isRegisteredOnBlockchain && (
                                      <Badge variant="secondary" className="text-xs">
                                        Registrado no Ledger
                                      </Badge>
                                    )}
                                  </div>
                                  {doc.blockchainRegisteredAt && (
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Registrado em {new Date(doc.blockchainRegisteredAt).toLocaleDateString('pt-BR')}
                                    </p>
                                  )}
                                  {doc.documentHash && (
                                    <p className="text-xs text-muted-foreground font-mono">
                                      Hash: {doc.documentHash.substring(0, 16)}...
                                    </p>
                                  )}
                                </div>
                              </div>

                              {doc.approvals && doc.approvals.length > 0 && (
                                <div className="mb-3 space-y-2">
                                  <p className="text-xs font-medium text-muted-foreground">Aprovações:</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {doc.approvals.map((approval) => (
                                      <div key={approval.id} className="flex items-center gap-1.5">
                                        {approval.status === "APPROVED" ? (
                                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : approval.status === "REJECTED" ? (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        ) : (
                                          <Clock className="h-3 w-3 text-yellow-600" />
                                        )}
                                        <span className="text-xs">
                                          {approval.role === "COORDINATOR" ? "Coord." :
                                           approval.role === "ADVISOR" ? "Orient." : "Aluno"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {needsStudentApproval && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 mb-3">
                                  <AlertCircle className="h-4 w-4 text-yellow-700 dark:text-yellow-500 mt-0.5 shrink-0" />
                                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                    Este documento precisa da sua aprovação antes de ser registrado no ledger.
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {doc.downloadUrl && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={doc.downloadUrl} download>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </a>
                                  </Button>
                                )}

                                {needsStudentApproval && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveDocument(doc)}
                                    disabled={isApproving}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {isApproving ? (
                                      <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        Aprovando...
                                      </>
                                    ) : (
                                      <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Aprovar Documento
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}
