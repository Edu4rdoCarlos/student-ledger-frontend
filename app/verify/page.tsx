"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shield, CheckCircle, XCircle, Sparkles, Lock, User, GraduationCap } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { verifyHashSchema, type VerifyHashFormData } from "@/lib/validations/document"
import { documentService } from "@/lib/services/document-service"
import type { Document } from "@/lib/types"

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Document | null | "not-found">(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyHashFormData>({
    resolver: zodResolver(verifyHashSchema),
  })

  const onSubmit = async (data: VerifyHashFormData) => {
    try {
      setLoading(true)
      const doc = await documentService.verifyDocumentHash(data.hash)
      setResult(doc || "not-found")
    } catch (error) {
      setResult("not-found")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Verificar Autenticidade
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Verifique a autenticidade de um documento através do hash SHA-256
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Imutável</p>
              <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5">Blockchain garante integridade</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Seguro</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">Criptografia SHA-256</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/30">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-violet-900 dark:text-violet-100">Rastreável</p>
              <p className="text-[10px] text-violet-700 dark:text-violet-300 mt-0.5">Auditoria completa</p>
            </div>
          </div>
        </div>

        {/* Hash Input Form */}
        <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-600" />
              Inserir Hash
            </CardTitle>
            <CardDescription>Cole o hash SHA-256 do documento para verificar sua autenticidade</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
                  className="font-mono text-sm h-12 bg-background/50 border-border/50"
                  {...register("hash")}
                />
                {errors.hash && <p className="text-xs text-destructive">{errors.hash.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 cursor-pointer"
                disabled={loading}
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
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardContent className="pt-6">
              {result === "not-found" ? (
                <div className="flex flex-col items-center space-y-4 text-center py-8">
                  <div className="rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 p-6 shadow-lg">
                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Documento Não Encontrado</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      O hash informado não corresponde a nenhum documento registrado no blockchain
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Header */}
                  <div className="flex flex-col items-center space-y-4 text-center pb-6 border-b border-border/50">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 shadow-lg">
                      <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-emerald-700 dark:text-emerald-400">Documento Autêntico</h3>
                      <p className="text-sm text-muted-foreground">
                        O documento foi verificado e está registrado no blockchain
                      </p>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Título do Documento</p>
                      <p className="font-semibold text-lg">{result.title}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <p className="text-xs font-medium text-muted-foreground">Aluno</p>
                        </div>
                        <p className="font-semibold">{result.studentName}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-xs font-medium text-muted-foreground">Orientador</p>
                        </div>
                        <p className="font-semibold">{result.orientadorName}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800/50 dark:to-indigo-900/20 border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Curso</p>
                      <p className="font-semibold">{result.course}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Hash SHA-256</p>
                      </div>
                      <p className="break-all font-mono text-xs text-emerald-800 dark:text-emerald-200 bg-emerald-100/50 dark:bg-emerald-950/30 p-2 rounded">
                        {result.hash}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
