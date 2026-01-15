import { api } from "@/lib/api"

export interface ApprovalRepository {
  overrideRejection(approvalId: string, reason: string): Promise<unknown>
  approveDocument(approvalId: string, justification?: string): Promise<unknown>
  rejectDocument(approvalId: string, justification: string): Promise<unknown>
  notifyApprover(approvalId: string): Promise<{ data: { success: boolean } }>
}

export const approvalRepository: ApprovalRepository = {
  async overrideRejection(approvalId: string, reason: string) {
    const response = await api.post(`/approvals/${approvalId}/override-rejection`, {
      reason,
    })
    return response
  },

  async approveDocument(approvalId: string, justification?: string) {
    const response = await api.post(`/approvals/${approvalId}/approve`, {
      justification,
    })
    return response
  },

  async rejectDocument(approvalId: string, justification: string) {
    const response = await api.post(`/approvals/${approvalId}/reject`, {
      justification,
    })
    return response
  },

  async notifyApprover(approvalId: string) {
    return api.post<{ data: { success: boolean } }>(`/approvals/${approvalId}/notify`)
  },
}
