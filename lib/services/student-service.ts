import { studentRepository } from "@/lib/repositories/student-repository"
import type { StudentFormData } from "@/lib/validations/student"

export const studentService = {
  async getAllStudents(page = 1, perPage = 10) {
    return studentRepository.getAll(page, perPage)
  },

  async getStudentByRegistration(registration: string) {
    const response = await studentRepository.getByRegistration(registration)
    return response.data
  },

  async createStudent(data: StudentFormData) {
    return studentRepository.create(data)
  },

  async updateStudent(id: string, data: Partial<StudentFormData>) {
    return studentRepository.update(id, data)
  },
}
