import type { Advisor, PaginationMetadata } from "@/lib/types"
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
}
