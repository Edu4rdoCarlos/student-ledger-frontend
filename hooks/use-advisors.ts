"use client"

import { useState, useEffect } from "react"
import { advisorService } from "@/lib/services/advisor-service"
import type { Advisor, PaginationMetadata } from "@/lib/types"

export function useAdvisors(page = 1, perPage = 10) {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAdvisors(page, perPage)
  }, [page, perPage])

  const loadAdvisors = async (currentPage = 1, currentPerPage = 10) => {
    try {
      setLoading(true)
      const response = await advisorService.getAllAdvisors(currentPage, currentPerPage)
      setAdvisors(response.data)
      setMetadata(response.metadata)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar orientadores")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    advisors,
    metadata,
    loading,
    error,
    refetch: loadAdvisors,
  }
}
