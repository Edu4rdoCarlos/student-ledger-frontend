"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/primitives/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { Badge } from "@/components/primitives/badge"
import { Input } from "@/components/primitives/input"
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  History,
  Shield,
  Search
} from "lucide-react"
import { useUser } from "@/lib/hooks/use-user-role"
import { isStudent } from "@/lib/types"
import type { Document, DocumentStatus } from "@/lib/types"
import { DocumentVersionsModal } from "@/components/documents/document-versions-modal"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const statusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive"; icon: any; color: string }> = {
  pendente: {
    label: "Pendente",
    variant: "default",
    icon: Clock,
    color: "text-yellow-600"
  },
  aprovado: {
    label: "Aprovado",
    variant: "secondary",
    icon: CheckCircle2,
    color: "text-green-600"
  },
  inativo: {
    label: "Inativo",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600"
  },
}

export default function DocumentsPage() {
  const { user } = useUser()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showVersionsModal, setShowVersionsModal] = useState(false)

  useEffect(() => {
    if (user && isStudent(user)) {
      // TODO: Buscar documentos do estudante da API
      // Por enquanto, usando dados mockados
      const mockDocuments: Document[] = []
      setDocuments(mockDocuments)
      setLoading(false)
    }
  }, [user])

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = (doc: Document) => {
    // TODO: Implementar download real
    console.log("Download documento:", doc.id)
  }

  const handleValidate = (doc: Document) => {
    // TODO: Implementar validação real (verificar hash na blockchain)
    console.log("Validar documento:", doc.hash)
  }

  const handleViewVersions = (doc: Document) => {
    setSelectedDocument(doc)
    setShowVersionsModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando documentos...</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Meus Documentos</h1>
            <p className="text-muted-foreground">
              Gerencie seus documentos de TCC, faça download e valide a autenticidade
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Enviar Documento
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "Nenhum documento encontrado" : "Nenhum documento enviado"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm
                ? "Tente ajustar sua busca ou limpe os filtros."
                : "Você ainda não enviou nenhum documento. Clique em 'Enviar Documento' para começar."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((doc) => {
            const StatusIcon = statusConfig[doc.status].icon
            return (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{doc.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant={statusConfig[doc.status].variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[doc.status].label}
                          </Badge>
                          <Badge variant="outline">
                            {doc.type === "ata" ? "Ata de Defesa" : "Ficha de Avaliação"}
                          </Badge>
                          <Badge variant="outline">
                            Versão {doc.version}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Orientador: {doc.orientadorName}</p>
                          <p>Curso: {doc.course}</p>
                          <p>Enviado em: {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Hash do documento */}
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Hash Blockchain</p>
                      </div>
                      <p className="text-xs font-mono break-all">{doc.hash}</p>
                    </div>

                    {/* Aprovações */}
                    {doc.approvals && doc.approvals.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Aprovações</p>
                        <div className="space-y-2">
                          {doc.approvals.map((approval, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                              <div>
                                <p className="font-medium">{approval.userName}</p>
                                <p className="text-xs text-muted-foreground">{approval.role}</p>
                              </div>
                              <Badge variant={approval.approved ? "secondary" : "destructive"}>
                                {approval.approved ? "Aprovado" : "Rejeitado"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aprovações pendentes */}
                    {doc.pendingApprovals && doc.pendingApprovals.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Aguardando Aprovação</p>
                        <div className="flex flex-wrap gap-2">
                          {doc.pendingApprovals.map((name, idx) => (
                            <Badge key={idx} variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleValidate(doc)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Validar Hash
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVersions(doc)}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Histórico de Versões
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal de Histórico de Versões */}
      {selectedDocument && (
        <DocumentVersionsModal
          document={selectedDocument}
          open={showVersionsModal}
          onClose={() => {
            setShowVersionsModal(false)
            setSelectedDocument(null)
          }}
        />
      )}
      </div>
    </DashboardLayout>
  )
}
