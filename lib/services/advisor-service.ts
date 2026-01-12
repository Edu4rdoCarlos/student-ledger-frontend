import { advisorRepository } from "@/lib/repositories/advisor-repository"
import type { AddAdvisorFormData, EditAdvisorFormData } from "@/lib/validations/advisor"

export const advisorService = {
  async getAllAdvisors(page = 1, perPage = 10) {
    return advisorRepository.getAll(page, perPage)
  },

  async getAdvisorById(id: string) {
    const response = await advisorRepository.getById(id)
    return response.data
  },

  async createAdvisor(data: AddAdvisorFormData) {
    return advisorRepository.create(data)
  },

  async updateAdvisor(id: string, data: EditAdvisorFormData) {
    return advisorRepository.update(id, data)
  },
}
