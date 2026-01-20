import type { Defense, PaginationMetadata } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface PaginatedDefensesResponse {
  data: Defense[]
  metadata: PaginationMetadata
}

export interface DefenseDetailResponse {
  data: Defense
}

export interface CreateDefensePayload {
  title: string
  defenseDate: string
  location: string
  advisorId: string
  studentIds: string[]
  examBoard: {
    name: string
    email: string
  }[]
}

export interface RescheduleDefensePayload {
  defenseDate: string
  rescheduleReason: string
}

export interface CancelDefensePayload {
  cancellationReason: string
}

export interface SubmitDefenseResultParams {
  defenseId: string
  finalGrade: number
  document: File
}

export interface DefenseRepository {
  getAll(page?: number, perPage?: number, order?: "asc" | "desc", search?: string): Promise<PaginatedDefensesResponse>
  getMyDefenses(): Promise<Defense[]>
  getById(id: string): Promise<DefenseDetailResponse>
  create(payload: CreateDefensePayload): Promise<DefenseDetailResponse>
  reschedule(id: string, payload: RescheduleDefensePayload): Promise<DefenseDetailResponse>
  cancel(id: string, payload: CancelDefensePayload): Promise<DefenseDetailResponse>
  submitResult(params: SubmitDefenseResultParams): Promise<DefenseDetailResponse>
}

export const defenseRepository: DefenseRepository = {
  async getAll(page = 1, perPage = 10, order = "desc", search = "") {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
    return apiClient.get<PaginatedDefensesResponse>(
      `/defenses?page=${page}&perPage=${perPage}&order=${order}${searchParam}`
    )
  },

  async getMyDefenses() {
    const response = await apiClient.get<{ data: Defense[] }>("/user/me/defenses")
    return response.data
  },

  async getById(id: string) {
    return apiClient.get<DefenseDetailResponse>(`/defenses/${id}`)
  },

  async create(payload: CreateDefensePayload) {
    return apiClient.post<DefenseDetailResponse>("/defenses", payload)
  },

  async reschedule(id: string, payload: RescheduleDefensePayload) {
    return apiClient.patch<DefenseDetailResponse>(`/defenses/${id}/reschedule`, payload)
  },

  async cancel(id: string, payload: CancelDefensePayload) {
    return apiClient.patch<DefenseDetailResponse>(`/defenses/${id}/cancel`, payload)
  },

  async submitResult({ defenseId, finalGrade, document }: SubmitDefenseResultParams) {
    const formData = new FormData()
    formData.append("finalGrade", finalGrade.toString())
    formData.append("document", document)
    return apiClient.uploadFormData<DefenseDetailResponse>(`/defenses/${defenseId}/result`, formData)
  },
}
