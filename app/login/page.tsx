"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCap, Lock, Mail, Shield, FileCheck, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { authService } from "@/lib/services/auth-service"
import { userService } from "@/lib/services/user-service"
import { useAuthStore } from "@/lib/store/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)

      const { accessToken } = await authService.login(data)

      setAuth(
        {
          id: "",
          name: "",
          email: "",
          role: "ADMIN",
          metadata: {},
        },
        accessToken
      )

      const user = await userService.getMe()
      setAuth(user, accessToken)

      // Aguarda o tema ser aplicado antes de redirecionar
      await new Promise((resolve) => setTimeout(resolve, 100))

      router.push("/dashboard")
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error instanceof Error ? error.message : "Credenciais inválidas",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 dark:opacity-20" />

      {/* Left side - Information panel */}
      <div className="relative hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Ledger
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de Gerenciamento Acadêmico</p>
            </div>
          </div>

          <div className="space-y-6 mt-16">
            <h2 className="text-4xl font-bold leading-tight text-foreground">
              Gestão de TCC com<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tecnologia Blockchain
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-md">
              Plataforma segura para gerenciamento de documentos acadêmicos com rastreabilidade e verificação via blockchain.
            </p>

            <div className="grid gap-4 mt-12">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Segurança Blockchain</h3>
                  <p className="text-sm text-muted-foreground">
                    Documentos protegidos com Hyperledger Fabric e certificados X.509
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <FileCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Fluxo de Aprovações</h3>
                  <p className="text-sm text-muted-foreground">
                    Workflow completo com assinaturas digitais de múltiplas partes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-border/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Gestão Colaborativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Coordenação entre secretaria, coordenadores, orientadores e alunos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            © 2025 Academic Ledger. Sistema desenvolvido para TCC.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Ledger
              </h1>
            </div>
          </div>

          <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-xl dark:bg-slate-900/80">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              </div>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-9 h-11 bg-background/50"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 h-11 bg-background/50"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Autenticando...
                    </span>
                  ) : (
                    "Entrar no Sistema"
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 p-4 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Protegido por blockchain:</strong> Todas as operações são registradas de forma imutável no Hyperledger Fabric.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
