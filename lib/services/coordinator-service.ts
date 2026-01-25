import { coordinatorRepository } from "@/lib/repositories/coordinator-repository"
import type { AddCoordinatorFormData } from "@/lib/validations/coordinator"

export const coordinatorService = {
  async getAllCoordinators(page = 1, perPage = 10) {
    return coordinatorRepository.getAll(page, perPage)
  },

  async createCoordinator(data: AddCoordinatorFormData) {
    return coordinatorRepository.create(data)
  },
}
