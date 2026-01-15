"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select"
import { User, Trophy, Mail, GraduationCap, Calendar, CheckCircle2, XCircle, Clock, MapPin, Users, Briefcase, Edit2, Save, X, Power } from "lucide-react"
import { Switch } from "@/components/primitives/switch"
import type { Advisor } from "@/lib/types"
import { Badge } from "@/components/primitives/badge"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { editAdvisorSchema, type EditAdvisorFormData } from "@/lib/validations/advisor"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useCourses } from "@/hooks/use-courses"
import { useAdvisorWithDefenses } from "@/hooks/use-advisor-with-defenses"
import { useAuthStore } from "@/lib/store/auth-store"

interface AdvisorDetailsModalProps {
  advisor: Advisor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateAdvisor?: (id: string, data: { name: string; specialization: string; courseId: string; isActive: boolean }) => Promise<void>
  loading?: boolean
}

export function AdvisorDetailsModal({ advisor, open, onOpenChange, onUpdateAdvisor, loading = false }: AdvisorDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { myCourses, loading: loadingCourses } = useCourses()
  const { user } = useAuthStore()

  const isSelectedAdvisorCoordinator = advisor?.userId === user?.id && user?.role === "COORDINATOR"
  const { defenses, loading: loadingDefenses } = useAdvisorWithDefenses(advisor, open)

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditAdvisorFormData>({
    resolver: zodResolver(editAdvisorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      courseId: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (advisor) {
      reset({
        name: advisor.name,
        specialization: advisor.specialization,
        courseId: advisor.course.id,
        isActive: advisor.isActive ?? true,
      })
    }
  }, [advisor, reset])

  if (!advisor) return null

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    reset({
      name: advisor.name,
      specialization: advisor.specialization,
      courseId: advisor.course.id,
      isActive: advisor.isActive ?? true,
    })
    setIsEditing(false)
  }

  const onSubmit = async (data: EditAdvisorFormData) => {
    if (!onUpdateAdvisor || !advisor?.userId) return

    try {
      await onUpdateAdvisor(advisor.userId, {
        name: data.name,
        specialization: data.specialization,
        courseId: data.courseId,
        isActive: data.isActive,
      })
      setIsEditing(false)
      toast.success("Orientador atualizado com sucesso!")
    } catch (error: any) {
      console.error("Erro ao atualizar orientador:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Erro desconhecido"
      toast.error("Erro ao atualizar orientador", {
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
                  <p>{advisor.name}</p>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    Orientador
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="profile" className="mt-6 flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="advisorships" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Orientações
                  {advisor.activeAdvisorshipsCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {advisor.activeAdvisorshipsCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tab: Perfil */}
              <TabsContent value="profile" className="space-y-6 mt-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Informações do Orientador</h3>
                  {!isSelectedAdvisorCoordinator && (
                    !isEditing ? (
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
                    )
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
                            placeholder="Nome completo do orientador"
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
                          <p className="text-base">{advisor.name}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{advisor.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Especialização</label>
                      {isEditing ? (
                        <>
                          <Input
                            {...register("specialization")}
                            placeholder="Especialização"
                            className="w-full"
                            disabled={isSubmitting}
                          />
                          {errors.specialization && (
                            <p className="text-sm text-red-600">{errors.specialization.message}</p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{advisor.specialization}</p>
                        </div>
                      )}
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
                                  {myCourses.map((course) => (
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
                            <p className="text-base font-medium">{advisor.course.name}</p>
                            <p className="text-sm text-muted-foreground">{advisor.course.code}</p>
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
                        <p className="text-base">{formatDate(advisor.createdAt)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{formatDate(advisor.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Orientações Ativas</label>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                          {advisor.activeAdvisorshipsCount} {advisor.activeAdvisorshipsCount === 1 ? "orientação" : "orientações"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div>
                        {advisor.hasActiveAdvisorship ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Com orientação ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            Sem orientação ativa
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Ativo</label>
                      {isEditing ? (
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                              <span className={`text-sm font-medium ${field.value ? "text-green-600" : "text-muted-foreground"}`}>
                                {field.value ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          )}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Power className="h-4 w-4 text-muted-foreground" />
                          {advisor.isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                              <XCircle className="h-3 w-3" />
                              Inativo
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </TabsContent>

              {/* Tab: Orientações */}
              <TabsContent value="advisorships" className="space-y-4 mt-6 flex-1 overflow-y-auto">
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
                    {defenses.map((defense) => (
                      <div
                        key={defense.id}
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
                              {defense.result !== "PENDING" && defense.finalGrade && (
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
                            {getDefenseStatusIcon(defense.result)}
                            <span className="text-sm font-medium">{getDefenseStatusText(defense.result)}</span>
                          </div>
                        </div>

                        {defense.students && defense.students.length > 0 && (
                          <div className="border-t border-border pt-3 mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              Alunos ({defense.students.length})
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {defense.students.map((student) => (
                                <div key={student.id} className="flex items-center gap-2 text-xs">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{student.name}</span>
                                    <span className="text-muted-foreground">{student.email} • {student.registration}</span>
                                  </div>
                                </div>
                              ))}
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
                              {defense.examBoard.map((member) => (
                                <div key={member.id} className="flex items-center gap-2 text-xs">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{member.name}</span>
                                    <span className="text-muted-foreground">{member.email}</span>
                                  </div>
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
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
