import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  authToken: z.string().length(6, "Token deve ter exatamente 6 dígitos").regex(/^\d{6}$/, "Token deve conter apenas números"),
})

export type LoginFormData = z.infer<typeof loginSchema>
