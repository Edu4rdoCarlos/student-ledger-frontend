"use client"

import { useState, useEffect } from "react"
import { defenseService } from "@/lib/services/defense-service"
import type { Advisor } from "@/lib/types"
import type { Defense } from "@/lib/types/defense"

interface UseAdvisorWithDefensesResult {
  defenses: Defense[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAdvisorWithDefenses(
  advisor: Advisor | null,
  fetchDefenses: boolean = true
): UseAdvisorWithDefensesResult {
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!advisor || !fetchDefenses) {
      setDefenses([])
      return
    }

    if (!advisor.defenseIds || advisor.defenseIds.length === 0) {
      setDefenses([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const defensePromises = advisor.defenseIds.map((id) =>
        defenseService.getDefenseById(id).catch((err) => {
          console.error(`Failed to fetch defense ${id}:`, err)
          return null
        })
      )

      const defensesData = await Promise.all(defensePromises)
      const validDefenses = defensesData.filter((d): d is Defense => d !== null)
      setDefenses(validDefenses)
    } catch (err) {
      console.error("Error fetching advisor defenses:", err)
      setError("Erro ao carregar defesas do orientador")
      setDefenses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [advisor?.userId, fetchDefenses])

  return {
    defenses,
    loading,
    error,
    refetch: fetchData,
  }
}
