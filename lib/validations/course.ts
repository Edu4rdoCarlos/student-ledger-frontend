import { z } from "zod"

export const createCourseSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  active: z.boolean().optional().default(true),
  coordinatorId: z.string().optional(),
})

export const updateCourseSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  active: z.boolean().optional(),
  coordinatorId: z.string().optional(),
})

export type CreateCourseFormData = z.infer<typeof createCourseSchema>
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>
