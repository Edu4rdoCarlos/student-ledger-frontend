import { z } from "zod"

export const documentSchema = z.object({
  type: z.enum(["ata", "ficha"], {
    required_error: "Tipo de documento é obrigatório",
  }),
  title: z.string().min(1, "Título é obrigatório"),
  studentId: z.string().min(1, "Aluno é obrigatório"),
  orientadorId: z.string().min(1, "Orientador é obrigatório"),
  course: z.string().min(1, "Curso é obrigatório"),
  file: z.instanceof(File, { message: "Arquivo PDF é obrigatório" }),
  date: z.string().min(1, "Data é obrigatória"),
})

export const approvalSchema = z.object({
  approved: z.boolean(),
  justification: z.string().optional(),
})

export const verifyHashSchema = z.object({
  hash: z.string().min(64, "Hash SHA-256 inválido").max(64, "Hash SHA-256 inválido"),
})

export type DocumentFormData = z.infer<typeof documentSchema>
export type ApprovalFormData = z.infer<typeof approvalSchema>
export type VerifyHashFormData = z.infer<typeof verifyHashSchema>
