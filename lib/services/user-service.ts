import { userRepository, type ChangePasswordRequest } from "@/lib/repositories/user-repository"

export const userService = {
  async getMe() {
    return userRepository.getMe()
  },

  async changePassword(data: ChangePasswordRequest) {
    return userRepository.changePassword(data)
  },
}
