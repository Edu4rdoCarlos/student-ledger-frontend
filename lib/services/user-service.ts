import { userRepository } from "@/lib/repositories/user-repository"

export const userService = {
  async getMe() {
    return userRepository.getMe()
  },
}
