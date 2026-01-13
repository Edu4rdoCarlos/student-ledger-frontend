import { api } from "@/lib/api"

export const approvalService = {
  async overrideRejection(approvalId: string, reason: string) {
    const response = await api.post(`/approvals/${approvalId}/override-rejection`, {
      reason,
    })
    return response.data
  },

  async approveDocument(approvalId: string, justification?: string) {
    const response = await api.post(`/approvals/${approvalId}/approve`, {
      justification,
    })
    return response.data
  },

  async rejectDocument(approvalId: string, justification: string) {
    const response = await api.post(`/approvals/${approvalId}/reject`, {
      justification,
    })
    return response.data
  },
}
