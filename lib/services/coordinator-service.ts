import { coordinatorRepository } from "@/lib/repositories/coordinator-repository"
import type { AddCoordinatorFormData, EditCoordinatorFormData } from "@/lib/validations/coordinator"

export const coordinatorService = {
  async getAllCoordinators(page = 1, perPage = 10) {
    return coordinatorRepository.getAll(page, perPage)
  },

  async createCoordinator(data: AddCoordinatorFormData) {
    return coordinatorRepository.create(data)
  },

  async updateCoordinator(userId: string, data: EditCoordinatorFormData) {
    return coordinatorRepository.update(userId, data)
  },
}
