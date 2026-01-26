import { apiClient } from "@/lib/api/client"

interface ApiResponse<T> {
  data: T
}

interface LoginData {
  accessToken: string
}

interface RefreshData {
  accessToken: string
}

export interface AuthRepository {
  login(email: string, password: string): Promise<{ accessToken: string }>
  refresh(): Promise<{ accessToken: string }>
  logout(): Promise<void>
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

const MOCK_USERS = {
  "admin@example.com": { password: "Admin123!", role: "ADMIN" },
  "coordenador.cc@example.com": { password: "Admin123!", role: "COORDINATOR" },
  "orientador1@example.com": { password: "Admin123!", role: "ADVISOR" },
  "aluno1@example.com": { password: "Admin123!", role: "STUDENT" },
}

const mockAuthRepository: AuthRepository = {
  async login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = MOCK_USERS[email as keyof typeof MOCK_USERS]
    if (!user || user.password !== password) {
      throw new Error("Email ou senha inválidos")
    }

    return {
      accessToken: `mock-token-${user.role}-${Date.now()}`,
    }
  },

  async refresh() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { accessToken: "mock-access-token-" + Date.now() }
  },

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 300))
  },
}

const realAuthRepository: AuthRepository = {
  async login(email: string, password: string) {
    const response = await apiClient.post<ApiResponse<LoginData>>(
      "/auth/login",
      { email, password },
      { skipAuth: true }
    )
    return {
      accessToken: response.data.accessToken,
    }
  },

  async refresh() {
    const response = await apiClient.post<ApiResponse<RefreshData>>("/auth/refresh", null, { skipAuth: true })
    return { accessToken: response.data.accessToken }
  },

  async logout() {
    await apiClient.post("/auth/logout")
  },
}

export const authRepository: AuthRepository = USE_MOCK ? mockAuthRepository : realAuthRepository
