import type { Defense, PaginationMetadata } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface PaginatedDefensesResponse {
  data: Defense[]
  metadata: PaginationMetadata
}

export interface DefenseDetailResponse {
  data: Defense
}

export interface SubmitDefenseResultParams {
  defenseId: string
  finalGrade: number
  document: File
}

export interface DefenseRepository {
  getAll(page?: number, perPage?: number, order?: "asc" | "desc", search?: string): Promise<PaginatedDefensesResponse>
  getById(id: string): Promise<DefenseDetailResponse>
  submitResult(params: SubmitDefenseResultParams): Promise<DefenseDetailResponse>
}

export const defenseRepository: DefenseRepository = {
  async getAll(page = 1, perPage = 10, order = "desc", search = "") {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
    return apiClient.get<PaginatedDefensesResponse>(
      `/defenses?page=${page}&perPage=${perPage}&order=${order}${searchParam}`
    )
  },

  async getById(id: string) {
    return apiClient.get<DefenseDetailResponse>(`/defenses/${id}`)
  },

  async submitResult({ defenseId, finalGrade, document }: SubmitDefenseResultParams) {
    const formData = new FormData()
    formData.append("finalGrade", finalGrade.toString())
    formData.append("document", document)
    return apiClient.uploadFormData<DefenseDetailResponse>(`/defenses/${defenseId}/result`, formData)
  },
}
