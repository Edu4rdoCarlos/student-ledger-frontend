import { studentRepository } from "@/lib/repositories/student-repository"
import type { StudentFormData } from "@/lib/validations/student"

export const studentService = {
  async getAllStudents() {
    return studentRepository.getAll()
  },

  async getStudentById(id: string) {
    return studentRepository.getById(id)
  },

  async getStudentByMatricula(matricula: string) {
    return studentRepository.getByMatricula(matricula)
  },

  async createStudent(data: StudentFormData) {
    return studentRepository.create(data)
  },

  async updateStudent(id: string, data: Partial<StudentFormData>) {
    return studentRepository.update(id, data)
  },
}
