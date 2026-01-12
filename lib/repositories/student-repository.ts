import type { Student, PaginationMetadata } from "@/lib/types"
import type { StudentFormData } from "@/lib/validations/student"
import { apiClient } from "@/lib/api/client"

export interface PaginatedStudentsResponse {
  data: Student[]
  metadata: PaginationMetadata
}

export interface StudentRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedStudentsResponse>
  getById(id: string): Promise<Student>
  getByMatricula(matricula: string): Promise<Student>
  create(data: StudentFormData): Promise<Student>
  update(id: string, data: Partial<StudentFormData>): Promise<Student>
}

export const studentRepository: StudentRepository = {
  async getAll(page = 1, perPage = 10) {
    return apiClient.get<PaginatedStudentsResponse>(
      `/students?page=${page}&perPage=${perPage}`
    )
  },

  async getById(id: string) {
    return apiClient.get<Student>(`/students/${id}`)
  },

  async getByMatricula(matricula: string) {
    return apiClient.get<Student>(`/students/registration/${matricula}`)
  },

  async create(data: StudentFormData) {
    return apiClient.post<Student>("/students", data)
  },

  async update(id: string, data: Partial<StudentFormData>) {
    return apiClient.patch<Student>(`/students/${id}`, data)
  },
}
