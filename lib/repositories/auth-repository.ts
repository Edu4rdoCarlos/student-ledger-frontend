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
  login(email: string, password: string, authToken: string): Promise<{ accessToken: string }>
  refresh(): Promise<{ accessToken: string }>
  logout(): Promise<void>
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

const mockAuthRepository: AuthRepository = {
  async login(email: string, password: string, authToken: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      accessToken: "mock-access-token-" + Date.now(),
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
  async login(email: string, password: string, authToken: string) {
    // POST /auth/login
    // Body: { email, password, authToken }
    // Response: { data: { accessToken } }
    // O backend também deve enviar Set-Cookie com refreshToken httpOnly
    const response = await apiClient.post<ApiResponse<LoginData>>(
      "/auth/login",
      { email, password, authToken },
      { skipAuth: true }
    )
    return {
      accessToken: response.data.accessToken,
    }
  },

  async refresh() {
    // POST /auth/refresh
    // O refreshToken é enviado automaticamente via cookie
    // Response: { data: { accessToken } }
    const response = await apiClient.post<ApiResponse<RefreshData>>("/auth/refresh", null, { skipAuth: true })
    return { accessToken: response.data.accessToken }
  },

  async logout() {
    // POST /auth/logout
    // Invalida o refreshToken no backend
    await apiClient.post("/auth/logout")
  },
}

export const authRepository: AuthRepository = USE_MOCK ? mockAuthRepository : realAuthRepository
