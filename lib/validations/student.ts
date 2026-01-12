import { z } from "zod"

export const studentSchema = z.object({
  registration: z.string().min(1, "Matrícula é obrigatória"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export const addStudentSchema = z.object({
  registration: z.string().min(1, "Matrícula é obrigatória"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export const editStudentSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  courseId: z.string().min(1, "Curso é obrigatório"),
})

export type StudentFormData = z.infer<typeof studentSchema>
export type AddStudentFormData = z.infer<typeof addStudentSchema>
export type EditStudentFormData = z.infer<typeof editStudentSchema>
