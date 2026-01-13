import { defenseRepository, type CreateDefensePayload, type RescheduleDefensePayload } from "@/lib/repositories/defense-repository"

export const defenseService = {
  async getAllDefenses(page = 1, perPage = 10, order: "asc" | "desc" = "desc", search = "") {
    return defenseRepository.getAll(page, perPage, order, search)
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
}
