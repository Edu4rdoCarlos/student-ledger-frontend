import { defenseRepository, type CreateDefensePayload, type RescheduleDefensePayload, type CancelDefensePayload } from "@/lib/repositories/defense-repository"

export const defenseService = {
  async getAllDefenses(page = 1, perPage = 10, order: "asc" | "desc" = "desc", search = "") {
    return defenseRepository.getAll(page, perPage, order, search)
  },

  async getMyDefenses() {
    return defenseRepository.getMyDefenses()
  },

  async getDefenseById(id: string) {
    const response = await defenseRepository.getById(id)
    return response.data
  },

  async createDefense(payload: CreateDefensePayload) {
    const response = await defenseRepository.create(payload)
    return response.data
  },

  async rescheduleDefense(id: string, payload: RescheduleDefensePayload) {
    const response = await defenseRepository.reschedule(id, payload)
    return response.data
  },

  async cancelDefense(id: string, payload: CancelDefensePayload) {
    const response = await defenseRepository.cancel(id, payload)
    return response.data
  },

  async submitResult(defenseId: string, finalGrade: number, minutesFile: File, evaluationFile: File) {
    const response = await defenseRepository.submitResult({ defenseId, finalGrade, minutesFile, evaluationFile })
    return response.data
  },
}
