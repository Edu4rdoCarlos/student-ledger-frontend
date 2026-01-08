import type { Student } from "@/lib/types"
import type { StudentFormData } from "@/lib/validations/student"

export interface StudentRepository {
  getAll(): Promise<Student[]>
  getById(id: string): Promise<Student>
  getByMatricula(matricula: string): Promise<Student>
  create(data: StudentFormData): Promise<Student>
  update(id: string, data: Partial<StudentFormData>): Promise<Student>
}

export const studentRepository: StudentRepository = {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return [
      {
        id: "1",
        matricula: "202301001",
        name: "Maria Santos",
        email: "maria@example.com",
        course: "Engenharia de Software",
        orientadorId: "1",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        matricula: "202301002",
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        course: "Ciência da Computação",
        orientadorId: "2",
        createdAt: "2024-01-20T10:00:00Z",
      },
    ]
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id,
      matricula: "202301001",
      name: "Maria Santos",
      email: "maria@example.com",
      course: "Engenharia de Software",
      orientadorId: "1",
      createdAt: "2024-01-15T10:00:00Z",
    }
  },

  async getByMatricula(matricula: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id: "1",
      matricula,
      name: "Maria Santos",
      email: "maria@example.com",
      course: "Engenharia de Software",
      orientadorId: "1",
      createdAt: "2024-01-15T10:00:00Z",
    }
  },

  async create(data: StudentFormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: String(Date.now()),
      ...data,
      createdAt: new Date().toISOString(),
    }
  },

  async update(id: string, data: Partial<StudentFormData>) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id,
      matricula: "202301001",
      name: data.name || "Maria Santos",
      email: data.email || "maria@example.com",
      course: data.course || "Engenharia de Software",
      orientadorId: data.orientadorId || "1",
      createdAt: "2024-01-15T10:00:00Z",
    }
  },
}
