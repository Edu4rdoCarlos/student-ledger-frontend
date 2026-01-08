import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

interface ApiResponse<T> {
  data: T
}

export interface UserRepository {
  getMe(): Promise<User>
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

const mockUserRepository: UserRepository = {
  async getMe() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
      role: "secretario" as const,
      organizationId: "org-1",
    }
  },
}

const realUserRepository: UserRepository = {
  async getMe() {
    // GET /users/me
    // Response: { data: { ...user } }
    const response = await apiClient.get<ApiResponse<User>>("/users/me")
    return response.data
  },
}

export const userRepository: UserRepository = USE_MOCK ? mockUserRepository : realUserRepository
