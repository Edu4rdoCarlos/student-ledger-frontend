import { approvalRepository } from "@/lib/repositories/approval-repository"

export const approvalService = {
  async overrideRejection(approvalId: string, reason: string) {
    return approvalRepository.overrideRejection(approvalId, reason)
  },

  async approveDocument(approvalId: string, justification?: string) {
    return approvalRepository.approveDocument(approvalId, justification)
  },

  async rejectDocument(approvalId: string, justification: string) {
    return approvalRepository.rejectDocument(approvalId, justification)
  },

  async notifyApprover(approvalId: string) {
    return approvalRepository.notifyApprover(approvalId)
  },
}
