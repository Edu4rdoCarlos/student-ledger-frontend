import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface IUserRepository {
  getMe(): Promise<User>
}

const MOCK_USER_DATA: Record<string, User> = {
  "admin@ufrgs.edu.br": {
    id: "1",
    name: "Admin Sistema",
    email: "admin@ufrgs.edu.br",
    role: "ADMIN" as const,
    metadata: {},
  },
  "coordenador.cc@ufrgs.edu.br": {
    id: "2",
    name: "Prof. Carlos Coordenador",
    email: "coordenador.cc@ufrgs.edu.br",
    role: "COORDINATOR" as const,
    metadata: {
      coordinator: {
        userId: "2",
        isActive: true,
        course: {
          id: "course-1",
          code: "CC",
          name: "Ciência da Computação",
          department: {
            id: "dept-1",
            name: "Departamento de Computação",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          coordinator: {
            id: "2",
            email: "coordenador.cc@ufrgs.edu.br",
            name: "Prof. Carlos Coordenador",
            role: "COORDINATOR",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        department: {
          id: "dept-1",
          name: "Departamento de Computação",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  "orientador1@ufrgs.edu.br": {
    id: "3",
    name: "Prof. Ana Orientadora",
    email: "orientador1@ufrgs.edu.br",
    role: "ADVISOR" as const,
    metadata: {
      advisor: {
        userId: "3",
        specialization: "Engenharia de Software",
        department: {
          id: "dept-1",
          name: "Departamento de Computação",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        course: {
          id: "course-1",
          code: "CC",
          name: "Ciência da Computação",
          department: {
            id: "dept-1",
            name: "Departamento de Computação",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          coordinator: {
            id: "2",
            email: "coordenador.cc@ufrgs.edu.br",
            name: "Prof. Carlos Coordenador",
            role: "COORDINATOR",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        defenses: [],
      },
    },
  },
  "aluno1@ufrgs.edu.br": {
    id: "4",
    name: "Maria Estudante",
    email: "aluno1@ufrgs.edu.br",
    role: "STUDENT" as const,
    metadata: {
      student: {
        userId: "4",
        registration: "00123456",
        course: {
          id: "course-1",
          code: "CC",
          name: "Ciência da Computação",
          department: {
            id: "dept-1",
            name: "Departamento de Computação",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          coordinator: {
            id: "2",
            email: "coordenador.cc@ufrgs.edu.br",
            name: "Prof. Carlos Coordenador",
            role: "COORDINATOR",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        defenses: [],
      },
    },
  },
}

class MockUserRepository implements IUserRepository {
  async getMe(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get user email from token (mock implementation looks at stored auth)
    const storedAuth = typeof window !== 'undefined'
      ? localStorage.getItem('auth-storage')
      : null

    if (storedAuth) {
      try {
        const { state } = JSON.parse(storedAuth)
        const email = state?.user?.email

        if (email && MOCK_USER_DATA[email]) {
          return MOCK_USER_DATA[email]
        }
      } catch {
        // Fall through to default
      }
    }

    // Default to admin if no stored email
    return MOCK_USER_DATA["admin@ufrgs.edu.br"]
  }
}

class RealUserRepository implements IUserRepository {
  async getMe(): Promise<User> {
    const response = await apiClient.get<{ data: User }>("/user/me")
    return response.data
  }
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

export const userRepository: IUserRepository = USE_MOCK
  ? new MockUserRepository()
  : new RealUserRepository()
