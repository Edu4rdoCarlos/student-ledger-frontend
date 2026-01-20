import { z } from "zod"

const passwordRegex = {
  minLength: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(passwordRegex.uppercase, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(passwordRegex.lowercase, "A senha deve conter pelo menos uma letra minúscula")
      .regex(passwordRegex.number, "A senha deve conter pelo menos um número")
      .regex(passwordRegex.special, "A senha deve conter pelo menos um caractere especial"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const passwordRules = [
  { key: "minLength", label: "Mínimo de 8 caracteres", regex: passwordRegex.minLength },
  { key: "uppercase", label: "Uma letra maiúscula", regex: passwordRegex.uppercase },
  { key: "lowercase", label: "Uma letra minúscula", regex: passwordRegex.lowercase },
  { key: "number", label: "Um número", regex: passwordRegex.number },
  { key: "special", label: "Um caractere especial (!@#$%...)", regex: passwordRegex.special },
]
