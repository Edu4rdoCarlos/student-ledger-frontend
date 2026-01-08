import { authRepository } from "@/lib/repositories/auth-repository"
import type { LoginFormData } from "@/lib/validations/auth"

export const authService = {
  async login(credentials: LoginFormData) {
    return authRepository.login(credentials.email, credentials.password, credentials.authToken)
  },

  async refresh() {
    return authRepository.refresh()
  },

  async logout() {
    return authRepository.logout()
  },
}
