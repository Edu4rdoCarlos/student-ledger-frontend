import { z } from "zod"

export const studentSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  course: z.string().min(1, "Curso é obrigatório"),
  orientadorId: z.string().min(1, "Orientador é obrigatório"),
})

export type StudentFormData = z.infer<typeof studentSchema>
