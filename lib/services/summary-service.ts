import { summaryRepository } from "@/lib/repositories/summary-repository"

export const summaryService = {
  async getDashboardSummary() {
    return summaryRepository.getSummary()
  },
}
