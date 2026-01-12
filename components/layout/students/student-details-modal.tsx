"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs"
import { User, Trophy, FileText, History, Mail, GraduationCap, Calendar, CheckCircle2, XCircle, Clock, Edit2, Save, X, Download, MapPin, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import type { Student } from "@/lib/types"
import { Badge } from "@/components/primitives/badge"
import { useState, useEffect } from "react"
import { documentService } from "@/lib/services/document-service"
import { toast } from "sonner"
import { editStudentSchema, type EditStudentFormData } from "@/lib/validations/student"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useCourses } from "@/hooks/use-courses"
import { useStudentWithDefenses } from "@/hooks/use-student-with-defenses"

interface StudentDetailsModalProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStudent?: (registration: string, data: { name: string; courseId: string }) => Promise<void>
  loading?: boolean
}

export function StudentDetailsModal({ student, open, onOpenChange, onUpdateStudent, loading = false }: StudentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { courses, loading: loadingCourses } = useCourses()

  const registration = student?.registration || student?.matricula || null
  const { defenses, loading: loadingDefenses } = useStudentWithDefenses(
    open ? registration : null,
    true
  )

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      courseId: "",
    },
  })

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        courseId: typeof student.course === 'string' ? '' : student.course.id,
      })
    }
  }, [student, reset])

  if (!student) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    reset({
      name: student.name,
      courseId: typeof student.course === 'string' ? '' : student.course.id,
    })
    setIsEditing(false)
  }

  const onSubmit = async (data: EditStudentFormData) => {
    if (!onUpdateStudent) return

    const registration = student.registration || student.matricula
    if (!registration) {
      toast.error("Erro", {
        description: "Matrícula do estudante não encontrada",
      })
      return
    }

    try {
      await onUpdateStudent(registration, {
        name: data.name,
        courseId: data.courseId,
      })
      setIsEditing(false)
      toast.success("Estudante atualizado com sucesso!")
    } catch (error: any) {
      console.error("Erro ao atualizar estudante:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido"
      toast.error("Erro ao atualizar estudante", {
        description: errorMessage,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getDocumentStatusIcon = (documentStatus: string) => {
    switch (documentStatus) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "INACTIVE":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getDocumentStatusText = (documentStatus: string) => {
    switch (documentStatus) {
      case "APPROVED":
        return "Aprovado"
      case "INACTIVE":
        return "Inativo"
      case "PENDING":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl !w-[85vw] min-h-[600px] max-h-[85vh] overflow-y-auto flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Carregando detalhes...</p>
            </div>
          </div>
        ) : (
          <>
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

            <Tabs defaultValue="profile" className="mt-6 flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 shrink-0">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="defenses" className="gap-2">
              <Trophy className="h-4 w-4" />
              Defesas
              {defenses.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {defenses.length}
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
          <TabsContent value="profile" className="space-y-6 mt-6 flex-1 overflow-y-auto">
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
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  {isEditing ? (
                    <>
                      <Input
                        {...register("name")}
                        placeholder="Nome completo do estudante"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </>
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
                    <>
                      <Controller
                        name="courseId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting || loadingCourses}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={loadingCourses ? "Carregando cursos..." : "Selecione o curso"} />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.name} ({course.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.courseId && (
                        <p className="text-sm text-red-600">{errors.courseId.message}</p>
                      )}
                    </>
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
          <TabsContent value="defenses" className="space-y-4 mt-6 flex-1 overflow-y-auto">
            {loadingDefenses ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Carregando defesas...</p>
                </div>
              </div>
            ) : defenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhuma defesa registrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {defenses.map((defense, idx) => (
                  <div
                    key={defense.documents?.[0]?.id || `defense-${idx}`}
                    className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-base">{defense.title}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(defense.defenseDate)}
                          </div>
                          {defense.result !== "PENDING" && (
                            <div className="flex items-center gap-1.5">
                              <Trophy className="h-3.5 w-3.5" />
                              Nota: {defense.finalGrade}
                            </div>
                          )}
                          {defense.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {defense.location}
                            </div>
                          )}
                          {defense.students && defense.students.length > 1 && (
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              <span className="font-medium">Defesa Compartilhada</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {defense.result === "APPROVED" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        {defense.result === "FAILED" && <XCircle className="h-4 w-4 text-red-600" />}
                        {defense.result === "PENDING" && <Clock className="h-4 w-4 text-yellow-600" />}
                        <span className="text-sm font-medium">
                          {defense.result === "APPROVED" && "Aprovado"}
                          {defense.result === "FAILED" && "Reprovado"}
                          {defense.result === "PENDING" && "Pendente"}
                        </span>
                      </div>
                    </div>

                    {defense.students && defense.students.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          Estudantes ({defense.students.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {defense.students.map((defenseStudent) => (
                            <div key={defenseStudent.id} className="bg-muted/30 rounded-lg p-3">
                              <div className="flex flex-col gap-1">
                                <p className="font-medium text-sm">{defenseStudent.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  {defenseStudent.registration}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {defenseStudent.email}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {defense.advisor && (
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          Orientador
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-sm">{defense.advisor.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {defense.advisor.email}
                            </div>
                            {defense.advisor.specialization && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <GraduationCap className="h-3 w-3" />
                                {defense.advisor.specialization}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {defense.examBoard && defense.examBoard.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          Banca Examinadora ({defense.examBoard.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {defense.examBoard.map((member, memberIndex) => (
                            <div key={memberIndex} className="flex items-center gap-2 text-xs">
                              <div className="flex flex-col">
                                <span className="font-medium">{member.name}</span>
                                <span className="text-muted-foreground">{member.email}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
          <TabsContent value="documents" className="space-y-4 mt-6 flex-1 overflow-y-auto">
            {loadingDefenses ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Carregando documentos...</p>
                </div>
              </div>
            ) : defenses.length === 0 || defenses.filter(d => d.documents && d.documents.length > 0).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Nenhum documento disponível</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Status do Documento:</strong> Indica se o documento foi aprovado por todas as assinaturas necessárias para registro no Hyperledger Fabric.
                  </p>
                </div>
                <div className="space-y-3">
                  {defenses
                    .filter(defense => defense.documents && defense.documents.length > 0)
                    .flatMap(defense =>
                      defense.documents!.map(doc => ({
                        defense,
                        doc
                      }))
                    )
                    .map(({ defense, doc }) => (
                    <div
                      key={doc.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-base mb-1">{defense.title}</p>
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span>Versão {doc.version}</span>
                                <span>Enviado em {formatDate(doc.createdAt)}</span>
                              </div>
                              {doc.changeReason && doc.version > 1 && (
                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">Motivo da atualização:</span> {doc.changeReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50">
                            {getDocumentStatusIcon(doc.status)}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{getDocumentStatusText(doc.status)}</span>
                              <span className="text-xs text-muted-foreground">
                                {doc.status === "APPROVED" && "Registrado no Hyperledger"}
                                {doc.status === "PENDING" && (() => {
                                  const approvedCount = doc.signatures?.filter(s => s.status === "APPROVED").length || 0
                                  const totalCount = doc.signatures?.length || 0
                                  return `Aguardando ${approvedCount}/${totalCount} assinaturas`
                                })()}
                                {doc.status === "INACTIVE" && "Documento inativado"}
                              </span>
                            </div>
                          </div>
                          {doc.status === "APPROVED" && doc.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  const blob = await documentService.downloadDocument(doc.id)
                                  const url = window.URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = `${defense.title}.pdf`
                                  document.body.appendChild(a)
                                  a.click()
                                  window.URL.revokeObjectURL(url)
                                  document.body.removeChild(a)
                                } catch (error) {
                                  console.error('Erro ao baixar documento:', error)
                                  toast.error('Erro ao baixar documento', {
                                    description: 'Não foi possível baixar o documento. Tente novamente mais tarde.',
                                  })
                                }
                              }}
                              className="gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            >
                              <Download className="h-4 w-4" />
                              Baixar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="history" className="space-y-4 mt-6 flex-1 overflow-y-auto">
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

                  {defenses.length > 0 && (
                    <>
                      {defenses.map((defense, idx) => (
                        <div key={defense.id || `history-defense-${idx}`} className="relative">
                          <div className="absolute -left-[1.6rem] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background"></div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Defesa: {defense.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(defense.defenseDate)}</p>
                            <p className="text-xs text-muted-foreground">
                              Resultado: {defense.result === "APPROVED" ? "Aprovado" : defense.result === "FAILED" ? "Reprovado" : "Pendente"}
                              {defense.result !== "PENDING" && ` - Nota: ${defense.finalGrade}`}
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
                  <p className="text-2xl font-bold">{defenses.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {defenses.filter(d => d.result === "APPROVED").length}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Reprovadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {defenses.filter(d => d.result === "FAILED").length}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
