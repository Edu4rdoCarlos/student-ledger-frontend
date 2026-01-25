import { z } from "zod"

export const addCoordinatorSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export type AddCoordinatorFormData = z.infer<typeof addCoordinatorSchema>
