import { z } from "zod"

export const addAdvisorSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  specialization: z.string().min(3, "Especialização deve ter no mínimo 3 caracteres"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export const editAdvisorSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  specialization: z.string().min(3, "Especialização deve ter no mínimo 3 caracteres"),
  courseId: z.string().min(1, "Curso é obrigatório"),
  isActive: z.boolean(),
})

export type AddAdvisorFormData = z.infer<typeof addAdvisorSchema>
export type EditAdvisorFormData = z.infer<typeof editAdvisorSchema>
