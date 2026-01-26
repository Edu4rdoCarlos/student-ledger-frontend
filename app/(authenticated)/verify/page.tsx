"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shield, CheckCircle, XCircle, Sparkles, Lock, User, GraduationCap, Upload, FileText, RotateCcw, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { verifyHashSchema, type VerifyHashFormData } from "@/lib/validations/document"
import { documentService } from "@/lib/services/document-service"
import type { DocumentValidationResponse } from "@/lib/types"
import { toast } from "sonner"

type ValidationResult = DocumentValidationResponse | null

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [calculatingHash, setCalculatingHash] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyHashFormData>({
    resolver: zodResolver(verifyHashSchema),
    mode: "onChange",
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setCalculatingHash(true)
      setUploadedFile(file)
      toast.info("Validando documento...")

      const response = await documentService.validateDocument(file)

      if (!response) {
        toast.error("Erro ao validar documento")
        return
      }

      setResult(response)

      if (response.document?.minutesCid) {
        setValue("hash", response.document.minutesCid)
      }

      switch (response.status) {
        case "APPROVED":
          toast.success("Documento autêntico!")
          break
        case "PENDING":
          toast.warning("Documento pendente de assinatura")
          break
        case "INACTIVE":
          toast.warning("Documento inativado")
          break
        case "NOT_FOUND":
          toast.error("Documento não encontrado no sistema")
          break
      }
    } catch (error) {
      toast.error("Erro ao validar documento")
      console.error(error)
    } finally {
      setCalculatingHash(false)
    }
  }

  const onSubmit = async (data: VerifyHashFormData) => {
    try {
      setLoading(true)
      const response = await documentService.verifyDocumentHash(data.hash)

      if (!response) {
        toast.error("Erro ao verificar documento")
        return
      }

      setResult(response)

      switch (response.status) {
        case "APPROVED":
          toast.success("Documento autêntico!")
          break
        case "PENDING":
          toast.warning("Documento pendente de assinatura")
          break
        case "INACTIVE":
          toast.warning("Documento inativado")
          break
        case "NOT_FOUND":
          toast.error("Documento não encontrado no sistema")
          break
      }
    } catch (error) {
      toast.error("Erro ao verificar documento")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetVerification = () => {
    setResult(null)
    setUploadedFile(null)
    setValue("hash", "")
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/30">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold text-primary">
                Verificar Autenticidade
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Verifique a autenticidade de um documento através do hash SHA-256
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary">Imutável</p>
              <p className="text-[10px] text-primary/80 mt-0.5">Blockchain garante integridade</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Seguro</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">Criptografia SHA-256</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary">Rastreável</p>
              <p className="text-[10px] text-primary/80 mt-0.5">Auditoria completa</p>
            </div>
          </div>
        </div>

        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          {!result ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Verificar Documento
                </CardTitle>
                <CardDescription>Faça upload do documento ou cole o hash SHA-256 para verificar sua autenticidade</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload do Documento</label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    disabled={calculatingHash}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      calculatingHash
                        ? "border-primary bg-primary/5 cursor-not-allowed"
                        : "border-border/50 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {calculatingHash ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                        <p className="text-sm text-muted-foreground">Calculando hash...</p>
                      </div>
                    ) : uploadedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <p className="text-sm font-medium text-primary">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">Clique para trocar</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-border/50"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">OU</span>
                <div className="flex-grow border-t border-border/50"></div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hash SHA-256</label>
                <Input
                  placeholder="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
                  className="text-sm h-12 bg-background/50 border-border/50"
                  {...register("hash")}
                />
                {errors.hash && <p className="text-xs text-destructive">{errors.hash.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
                disabled={loading || calculatingHash}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verificar Hash
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
            </>
          ) : (
            <CardContent className="pt-6">
              {result.status === "NOT_FOUND" ? (
                <div className="flex flex-col items-center space-y-4 text-center py-8">
                  <div className="rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 p-6 shadow-lg">
                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">Documento Não Encontrado</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Este documento não foi submetido ao sistema. Possível documento fraudulento.
                    </p>
                  </div>
                  <Button
                    onClick={resetVerification}
                    variant="outline"
                    className="mt-4"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Nova Verificação
                  </Button>
                </div>
              ) : result.status === "PENDING" || result.status === "INACTIVE" ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 text-center pb-6 border-b border-border/50">
                    <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 p-6 shadow-lg">
                      <Clock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-amber-700 dark:text-amber-400">
                        {result.status === "INACTIVE" ? "Documento Inativo" : "Documento Pendente"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.status === "INACTIVE"
                          ? "Este documento foi inativado e não está mais válido"
                          : "Documento pendente de assinatura"}
                      </p>
                    </div>
                  </div>

                  {result.document && (
                    <div className="space-y-4">
                      {result.document.defenseInfo?.students && result.document.defenseInfo.students.length > 0 && (
                        <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-primary" />
                            <p className="text-xs font-medium text-muted-foreground">Aluno(s)</p>
                          </div>
                          <p className="font-semibold">{result.document.defenseInfo.students.join(", ") || "Não informado"}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.document.defenseInfo?.advisor && (
                          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <p className="text-xs font-medium text-muted-foreground">Orientador</p>
                            </div>
                            <p className="font-semibold">{result.document.defenseInfo.advisor || "Não informado"}</p>
                          </div>
                        )}

                        {result.document.defenseInfo?.course && (
                          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Curso</p>
                            <p className="font-semibold">{result.document.defenseInfo.course || "Não informado"}</p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/50 dark:border-amber-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Tipo de Documento</p>
                        </div>
                        <p className="font-semibold text-amber-800 dark:text-amber-200">
                          {result.document.documentType === "minutes" ? "Ata" : "Avaliação de Desempenho"}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200/50 dark:border-amber-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Hash SHA-256</p>
                        </div>
                        <p className="break-all   text-xs text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-950/30 p-2 rounded">
                          {result.document.documentType === "minutes" ? result.document.minutesHash : result.document.evaluationHash}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={resetVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Nova Verificação
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 text-center pb-6 border-b border-border/50">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 shadow-lg">
                      <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-emerald-700 dark:text-emerald-400">Documento Autêntico</h3>
                      <p className="text-sm text-muted-foreground">
                        O documento foi verificado e está registrado na blockchain
                      </p>
                    </div>
                  </div>

                  {result.document && (
                    <div className="space-y-4">
                      {result.document.defenseInfo?.students && result.document.defenseInfo.students.length > 0 && (
                        <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-primary" />
                            <p className="text-xs font-medium text-muted-foreground">Aluno(s)</p>
                          </div>
                          <p className="font-semibold">{result.document.defenseInfo.students.join(", ")}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.document.defenseInfo?.advisor && (
                          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <p className="text-xs font-medium text-muted-foreground">Orientador</p>
                            </div>
                            <p className="font-semibold">{result.document.defenseInfo.advisor}</p>
                          </div>
                        )}

                        {result.document.defenseInfo?.course && (
                          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Curso</p>
                            <p className="font-semibold">{result.document.defenseInfo.course}</p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Tipo de Documento</p>
                        </div>
                        <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                          {result.document.documentType === "minutes" ? "Ata" : "Avaliação de Desempenho"}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Hash SHA-256</p>
                        </div>
                        <p className="break-all text-xs text-emerald-800 dark:text-emerald-200 bg-emerald-100/50 dark:bg-emerald-950/30 p-2 rounded">
                          {result.document.documentType === "minutes" ? result.document.minutesHash : result.document.evaluationHash}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={resetVerification}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Nova Verificação
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
