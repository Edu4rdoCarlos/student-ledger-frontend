"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api/client"

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface ApprovalItem {
  id: string
  role: string
  status: ApprovalStatus
  approverName: string
  approvedAt?: string
  approverId?: string
  justification?: string
}

export interface DocumentApprovalSummary {
  total: number
  approved: number
  pending: number
  rejected: number
}

export interface DocumentWithApprovals {
  documentId: string
  documentTitle: string
  students: Array<{
    name: string
    email: string
    registration: string
  }>
  courseName: string
  createdAt: string
  approvals: ApprovalItem[]
  summary: DocumentApprovalSummary
}

export interface PendingApproval extends DocumentWithApprovals {
  id: string
  role: "ADVISOR" | "COORDINATOR" | "ADMIN" | "STUDENT"
  status: ApprovalStatus
  approverId?: string
  signatures: ApprovalItem[]
}

export function useApprovals(statusFilter: ApprovalStatus = "PENDING") {
  const [approvals, setApprovals] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApprovals = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<{ data: DocumentWithApprovals[] }>(
        `/approvals?status=${statusFilter}`
      )

      const transformedData: PendingApproval[] = response.data.map((doc) => ({
        ...doc,
        id: doc.documentId,
        role: "PENDING" as any,
        status: statusFilter,
        signatures: doc.approvals,
      }))

      setApprovals(transformedData)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar aprovações")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadApprovals()
  }, [loadApprovals])

  return {
    approvals,
    loading,
    error,
    refetch: loadApprovals,
  }
}
