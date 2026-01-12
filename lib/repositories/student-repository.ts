import type { Student, PaginationMetadata } from "@/lib/types"
import type { StudentFormData } from "@/lib/validations/student"
import { apiClient } from "@/lib/api/client"

export interface PaginatedStudentsResponse {
  data: Student[]
  metadata: PaginationMetadata
}

export interface StudentDetailResponse {
  data: Student
}

export interface StudentRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedStudentsResponse>
  getById(id: string): Promise<StudentDetailResponse>
  getByRegistration(registration: string): Promise<StudentDetailResponse>
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
    return apiClient.get<StudentDetailResponse>(`/students/${id}`)
  },

  async getByRegistration(registration: string) {
    return apiClient.get<StudentDetailResponse>(`/students/${registration}`)
  },

  async create(data: StudentFormData) {
    return apiClient.post<Student>("/students", data)
  },

  async update(id: string, data: Partial<StudentFormData>) {
    return apiClient.patch<Student>(`/students/${id}`, data)
  },
}
