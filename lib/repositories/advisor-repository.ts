import type { Advisor, PaginationMetadata } from "@/lib/types"
import type { AddAdvisorFormData, EditAdvisorFormData } from "@/lib/validations/advisor"
import { apiClient } from "@/lib/api/client"

export interface PaginatedAdvisorsResponse {
  data: Advisor[]
  metadata: PaginationMetadata
}

export interface AdvisorDetailResponse {
  data: Advisor
}

export interface AdvisorRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedAdvisorsResponse>
  getById(id: string): Promise<AdvisorDetailResponse>
  create(data: AddAdvisorFormData): Promise<Advisor>
  update(id: string, data: EditAdvisorFormData): Promise<Advisor>
}

export const advisorRepository: AdvisorRepository = {
  async getAll(page = 1, perPage = 10) {
    return apiClient.get<PaginatedAdvisorsResponse>(
      `/advisors?page=${page}&perPage=${perPage}`
    )
  },

  async getById(id: string) {
    return apiClient.get<AdvisorDetailResponse>(`/advisors/${id}`)
  },

  async create(data: AddAdvisorFormData) {
    return apiClient.post<Advisor>("/advisors", data)
  },

  async update(id: string, data: EditAdvisorFormData) {
    return apiClient.put<Advisor>(`/advisors/${id}`, data)
  },
}
