"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Check, X, Lock, KeyRound } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/shared/dialog"
import { Button } from "@/components/primitives/button"
import { Input } from "@/components/primitives/input"
import { userService } from "@/lib/services/user-service"
import { useAuthStore } from "@/lib/store/auth-store"
import {
  changePasswordSchema,
  type ChangePasswordFormData,
  passwordRules,
} from "@/lib/validations/change-password"
import { cn } from "@/lib/utils/cn"

interface ChangePasswordModalProps {
  open: boolean
  onSuccess: () => void
  isFirstAccess?: boolean
}

export function ChangePasswordModal({ open, onSuccess, isFirstAccess = false }: ChangePasswordModalProps) {
  const { user, setAuth, accessToken } = useAuthStore()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && !isFirstAccess) {
      onSuccess()
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const newPassword = watch("newPassword", "")

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await userService.changePassword(data)

      if (user && accessToken) {
        setAuth({ ...user, isFirstAccess: false }, accessToken)
      }

      toast.success("Senha alterada com sucesso!")
      reset()
      onSuccess()
    } catch {
      toast.error("Erro ao alterar senha. Verifique a senha atual e tente novamente:")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isFirstAccess} className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isFirstAccess ? "Alteração de Senha Obrigatória" : "Alterar Senha"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isFirstAccess
                  ? "Por segurança, você precisa alterar sua senha no primeiro acesso."
                  : "Digite sua senha atual e a nova senha para continuar."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                Senha Atual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Digite sua senha atual"
                  className="pl-10 pr-10"
                  {...register("currentPassword")}
                  aria-invalid={!!errors.currentPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  className="pl-10 pr-10"
                  {...register("newPassword")}
                  aria-invalid={!!errors.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                A senha deve conter:
              </p>
              <ul className="space-y-2">
                {passwordRules.map((rule) => {
                  const isValid = rule.regex.test(newPassword)
                  return (
                    <li
                      key={rule.key}
                      className={cn(
                        "flex items-center gap-2 text-sm transition-colors",
                        isValid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full transition-colors",
                          isValid
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-muted"
                        )}
                      >
                        {isValid ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </div>
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Alterando senha...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
