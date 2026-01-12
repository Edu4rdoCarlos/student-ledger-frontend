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
  getByRegistration(registration: string): Promise<StudentDetailResponse>
  create(data: StudentFormData): Promise<Student>
  update(registration: string, data: { name: string; courseId: string }): Promise<Student>
}

export const studentRepository: StudentRepository = {
  async getAll(page = 1, perPage = 10) {
    return apiClient.get<PaginatedStudentsResponse>(
      `/students?page=${page}&perPage=${perPage}`
    )
  },


  async getByRegistration(registration: string) {
    return apiClient.get<StudentDetailResponse>(`/students/${registration}`)
  },

  async create(data: StudentFormData) {
    return apiClient.post<Student>("/students", data)
  },

  async update(registration: string, data: { name: string; courseId: string }) {
    return apiClient.put<Student>(`/students/${registration}`, data)
  },
}
