import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface IUserRepository {
  getMe(): Promise<User>
  changePassword(data: ChangePasswordRequest): Promise<void>
}

class UserRepository implements IUserRepository {
  async getMe(): Promise<User> {
    const response = await apiClient.get<{ data: User }>("/user/me")
    return response.data
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.patch("/user/me/password", data)
  }
}

export const userRepository: IUserRepository = new UserRepository()
