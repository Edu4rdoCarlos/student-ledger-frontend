import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface IUserRepository {
  getMe(): Promise<User>
}

class UserRepository implements IUserRepository {
  async getMe(): Promise<User> {
    const response = await apiClient.get<{ data: User }>("/user/me")
    return response.data
  }
}

export const userRepository: IUserRepository = new UserRepository()
