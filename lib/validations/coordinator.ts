import { z } from "zod"

export const addCoordinatorSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export type AddCoordinatorFormData = z.infer<typeof addCoordinatorSchema>

export const editCoordinatorSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  courseId: z.string(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  // Se está ativo, o curso é obrigatório
  if (data.isActive !== false && !data.courseId) {
    return false;
  }
  return true;
}, {
  message: "Curso é obrigatório para coordenadores ativos",
  path: ["courseId"],
})

export type EditCoordinatorFormData = z.infer<typeof editCoordinatorSchema>
