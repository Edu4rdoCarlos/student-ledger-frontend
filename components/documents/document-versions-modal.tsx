"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { Download, Shield, CheckCircle2, Clock, XCircle, FileText } from "lucide-react"
import type { Document, DocumentStatus } from "@/lib/types"

interface DocumentVersion {
  id: string
  version: number
  hash: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
  approvals: Array<{
    userId: string
    userName: string
    role: string
    approved: boolean
    justification?: string
    createdAt: string
  }>
  inactivatedAt?: string
  inactivationReason?: string
}

interface DocumentVersionsModalProps {
  document: Document
  open: boolean
  onClose: () => void
}

const statusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: any }> = {
  pendente: {
    label: "Pendente",
    variant: "default",
    icon: Clock,
  },
  aprovado: {
    label: "Aprovado",
    variant: "secondary",
    icon: CheckCircle2,
  },
  inativo: {
    label: "Inativo",
    variant: "destructive",
    icon: XCircle,
  },
}

export function DocumentVersionsModal({ document, open, onClose }: DocumentVersionsModalProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && document) {
      fetchVersions()
    }
  }, [open, document])

  const fetchVersions = async () => {
    setLoading(true)
    try {
      // TODO: Buscar versões da API
      // Por enquanto, usando dados mockados
      const mockVersions: DocumentVersion[] = [
        {
          id: document.id,
          version: document.version,
          hash: document.hash,
          status: document.status,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
          approvals: document.approvals || [],
          inactivatedAt: document.inactivatedAt,
          inactivationReason: document.inactivationReason,
        },
      ]
      setVersions(mockVersions)
    } catch (error) {
      console.error("Erro ao buscar versões:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadVersion = (version: DocumentVersion) => {
    // TODO: Implementar download real
    console.log("Download versão:", version.version)
  }

  const handleValidateVersion = (version: DocumentVersion) => {
    // TODO: Implementar validação real (verificar hash na blockchain)
    console.log("Validar versão:", version.hash)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Histórico de Versões</DialogTitle>
          <DialogDescription>
            Visualize todas as versões do documento "{document.title}"
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Carregando versões...</p>
            </div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhuma versão encontrada</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {versions.map((version, index) => {
              const StatusIcon = statusConfig[version.status].icon
              const isCurrentVersion = version.version === document.version

              return (
                <div
                  key={version.id}
                  className={`rounded-lg border p-4 space-y-4 transition-colors ${
                    isCurrentVersion ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {/* Cabeçalho da versão */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Versão {version.version}</h3>
                        {isCurrentVersion && (
                          <Badge variant="outline" className="text-xs">
                            Versão Atual
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={statusConfig[version.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[version.status].label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Informações da versão */}
                  <div className="space-y-3">
                    {/* Hash */}
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Hash Blockchain</p>
                      </div>
                      <p className="text-xs font-mono break-all">{version.hash}</p>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Criado em</p>
                        <p className="font-medium">
                          {new Date(version.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Atualizado em</p>
                        <p className="font-medium">
                          {new Date(version.updatedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Aprovações */}
                    {version.approvals && version.approvals.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Aprovações</p>
                        <div className="space-y-2">
                          {version.approvals.map((approval, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between text-sm p-2 rounded-lg bg-muted/30"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{approval.userName}</p>
                                <p className="text-xs text-muted-foreground">{approval.role}</p>
                                {approval.justification && (
                                  <p className="text-xs mt-1 text-muted-foreground">
                                    "{approval.justification}"
                                  </p>
                                )}
                              </div>
                              <Badge variant={approval.approved ? "secondary" : "destructive"}>
                                {approval.approved ? "Aprovado" : "Rejeitado"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informações de inativação */}
                    {version.inactivatedAt && version.inactivationReason && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                        <p className="text-sm font-medium text-destructive mb-1">
                          Documento Inativado
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(version.inactivatedAt).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm">{version.inactivationReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadVersion(version)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleValidateVersion(version)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Validar Hash
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
