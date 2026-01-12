"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs"
import { User, Trophy, FileText, History, Mail, GraduationCap, Calendar, CheckCircle2, XCircle, Clock, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import type { Student } from "@/lib/types"
import { Badge } from "@/components/primitives/badge"
import { useState, useEffect } from "react"

interface StudentDetailsModalProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStudent?: (studentId: string, data: { name: string; courseId: string }) => Promise<void>
}

export function StudentDetailsModal({ student, open, onOpenChange, onUpdateStudent }: StudentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedCourseId, setEditedCourseId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (student) {
      setEditedName(student.name)
      setEditedCourseId(typeof student.course === 'string' ? '' : student.course.id)
    }
  }, [student])

  if (!student) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedName(student.name)
    setEditedCourseId(typeof student.course === 'string' ? '' : student.course.id)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!onUpdateStudent) return

    setIsSaving(true)
    try {
      await onUpdateStudent(student.id || student.userId, {
        name: editedName,
        courseId: editedCourseId,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar estudante:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getDefenseStatusIcon = (result: string) => {
    switch (result) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getDefenseStatusText = (result: string) => {
    switch (result) {
      case "APPROVED":
        return "Aprovado"
      case "FAILED":
        return "Reprovado"
      default:
        return "Pendente"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p>{student.name}</p>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {student.registration || student.matricula}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="defenses" className="gap-2">
              <Trophy className="h-4 w-4" />
              Defesas
              {student.defenses && student.defenses.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {student.defenses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Tab: Perfil */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Informações do Estudante</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Nome completo do estudante"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{student.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Matrícula</label>
                  <p className="text-base font-mono">{student.registration || student.matricula}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{student.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Curso</label>
                  {isEditing ? (
                    <Select
                      value={editedCourseId || undefined}
                      onValueChange={setEditedCourseId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeof student.course !== 'string' && student.course.id && (
                          <SelectItem value={student.course.id}>
                            {student.course.name} ({student.course.code})
                          </SelectItem>
                        )}
                        {/* Mais opções de cursos virão da API */}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <p className="text-base font-medium">
                          {typeof student.course === 'string' ? student.course : student.course.name}
                        </p>
                        {typeof student.course !== 'string' && (
                          <p className="text-sm text-muted-foreground">{student.course.code}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(student.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(student.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Defesas */}
          <TabsContent value="defenses" className="space-y-4 mt-6">
            {!student.defenses || student.defenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhuma defesa registrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {student.defenses.map((defense, index) => (
                  <div
                    key={defense.documentId}
                    className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-base">{defense.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(defense.defenseDate)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Trophy className="h-3.5 w-3.5" />
                            Nota: {defense.finalGrade}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDefenseStatusIcon(defense.result)}
                        <span className="text-sm font-medium">{getDefenseStatusText(defense.result)}</span>
                      </div>
                    </div>

                    {defense.signatures && defense.signatures.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Assinaturas ({defense.signatures.length})</p>
                        <div className="grid grid-cols-3 gap-2">
                          {defense.signatures.map((signature, sigIndex) => (
                            <div key={sigIndex} className="flex items-center gap-2 text-xs">
                              {signature.status === "APPROVED" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                              {signature.status === "REJECTED" && <XCircle className="h-3 w-3 text-red-600" />}
                              {signature.status === "PENDING" && <Clock className="h-3 w-3 text-yellow-600" />}
                              <span className="capitalize">{signature.role.toLowerCase()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Documentos */}
          <TabsContent value="documents" className="space-y-4 mt-6">
            {!student.defenses || student.defenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhum documento disponível</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.defenses.map((defense) => (
                  <div
                    key={defense.documentId}
                    className="border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{defense.title}</p>
                        <p className="text-xs text-muted-foreground">Versão {defense.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={defense.status === "APPROVED" ? "default" : "secondary"}>
                        {defense.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">IPFS: {defense.ipfsCid.slice(0, 8)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Timeline Acadêmica</h4>
                <div className="relative space-y-4 pl-6 border-l-2 border-border">
                  <div className="relative">
                    <div className="absolute -left-[1.6rem] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Cadastro no Sistema</p>
                      <p className="text-xs text-muted-foreground">{formatDate(student.createdAt)}</p>
                    </div>
                  </div>

                  {student.defenses && student.defenses.length > 0 && (
                    <>
                      {student.defenses.map((defense, index) => (
                        <div key={defense.documentId} className="relative">
                          <div className="absolute -left-[1.6rem] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Defesa: {defense.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(defense.defenseDate)}</p>
                            <p className="text-xs text-muted-foreground">
                              Resultado: {getDefenseStatusText(defense.result)} - Nota: {defense.finalGrade}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="relative">
                    <div className="absolute -left-[1.6rem] mt-1.5 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Última Atualização</p>
                      <p className="text-xs text-muted-foreground">{formatDate(student.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Total de Defesas</p>
                  <p className="text-2xl font-bold">{student.defenses?.length || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {student.defenses?.filter(d => d.result === "APPROVED").length || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Reprovadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {student.defenses?.filter(d => d.result === "FAILED").length || 0}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
