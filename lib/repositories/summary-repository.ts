import type { DashboardSummary } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface SummaryRepository {
  getSummary(): Promise<DashboardSummary>
}

export const summaryRepository: SummaryRepository = {
  async getSummary() {
    return apiClient.get<DashboardSummary>("/documents/summary")
  },
}
