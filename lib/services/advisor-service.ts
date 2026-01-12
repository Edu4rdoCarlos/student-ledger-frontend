import { advisorRepository } from "@/lib/repositories/advisor-repository"

export const advisorService = {
  async getAllAdvisors(page = 1, perPage = 10) {
    return advisorRepository.getAll(page, perPage)
  },

  async getAdvisorById(id: string) {
    const response = await advisorRepository.getById(id)
    return response.data
  },
}
