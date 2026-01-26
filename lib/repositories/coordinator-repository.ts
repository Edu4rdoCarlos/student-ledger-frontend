import type { Coordinator, PaginationMetadata } from "@/lib/types"
import type { AddCoordinatorFormData, EditCoordinatorFormData } from "@/lib/validations/coordinator"
import { apiClient } from "@/lib/api/client"

export interface PaginatedCoordinatorsResponse {
  data: Coordinator[]
  metadata: PaginationMetadata
}

export interface CoordinatorDetailResponse {
  data: Coordinator
}

export interface CoordinatorRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedCoordinatorsResponse>
  create(data: AddCoordinatorFormData): Promise<Coordinator>
  update(userId: string, data: EditCoordinatorFormData): Promise<Coordinator>
}

export const coordinatorRepository: CoordinatorRepository = {
  async getAll(page = 1, perPage = 10) {
    return apiClient.get<PaginatedCoordinatorsResponse>(
      `/coordinators?page=${page}&perPage=${perPage}`
    )
  },

  async create(data: AddCoordinatorFormData) {
    return apiClient.post<Coordinator>("/coordinators", data)
  },

  async update(userId: string, data: EditCoordinatorFormData) {
    return apiClient.put<Coordinator>(`/coordinators/${userId}`, data)
  },
}
