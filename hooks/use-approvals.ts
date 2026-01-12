"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"

export interface PendingApproval {
  id: string
  role: "ADVISOR" | "COORDINATOR" | "ADMIN" | "STUDENT"
  status: "PENDING" | "APPROVED" | "REJECTED"
  justification?: string
  approvedAt?: string
  createdAt: string
  updatedAt?: string
  documentId: string
  approverId: string
  documentTitle: string
  students: Array<{
    name: string
    registration: string
  }>
  courseName: string
  signatures: Array<{
    role: "ADVISOR" | "COORDINATOR" | "ADMIN" | "STUDENT"
    status: "PENDING" | "APPROVED" | "REJECTED"
    approverName: string
    approvedAt?: string
    justification?: string
  }>
}

export function useApprovals() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<{ data: PendingApproval[] }>("/approvals")
      setApprovals(response.data)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar aprovações")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    approvals,
    loading,
    error,
    refetch: loadApprovals,
  }
}
