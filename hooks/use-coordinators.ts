"use client"

import { useState, useEffect } from "react"
import { coordinatorService } from "@/lib/services/coordinator-service"
import type { Coordinator, PaginationMetadata } from "@/lib/types"

export function useCoordinators(page = 1, perPage = 10) {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCoordinators(page, perPage)
  }, [page, perPage])

  const loadCoordinators = async (currentPage = 1, currentPerPage = 10) => {
    try {
      setLoading(true)
      const response = await coordinatorService.getAllCoordinators(currentPage, currentPerPage)
      setCoordinators(response.data)
      setMetadata(response.metadata)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar coordenadores")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    coordinators,
    metadata,
    loading,
    error,
    refetch: loadCoordinators,
  }
}
