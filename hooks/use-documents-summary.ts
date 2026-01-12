"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"

export interface DocumentsSummary {
  totalDocuments: number
  pendingDocuments: number
  approvedDocuments: number
  totalStudents: number
}

export function useDocumentsSummary() {
  const [summary, setSummary] = useState<DocumentsSummary>({
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    totalStudents: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<DocumentsSummary>("/documents/summary")
      setSummary(response)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar resumo de documentos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    summary,
    loading,
    error,
    refetch: loadSummary,
  }
}
