"use client"

import { useState, useEffect } from "react"
import { studentService } from "@/lib/services/student-service"
import { defenseService } from "@/lib/services/defense-service"
import type { Student } from "@/lib/types"
import type { Defense } from "@/lib/types/defense"

interface UseStudentWithDefensesResult {
  student: Student | null
  defenses: Defense[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStudentWithDefenses(
  registration: string | null,
  fetchDefenses: boolean = true
): UseStudentWithDefensesResult {
  const [student, setStudent] = useState<Student | null>(null)
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!registration) {
      setStudent(null)
      setDefenses([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const studentData = await studentService.getStudentByRegistration(registration)
      setStudent(studentData)

      if (fetchDefenses && studentData.defenseIds && studentData.defenseIds.length > 0) {
        const defensePromises = studentData.defenseIds.map((id) =>
          defenseService.getDefenseById(id).catch((err) => {
            console.error(`Failed to fetch defense ${id}:`, err)
            return null
          })
        )

        const defensesData = await Promise.all(defensePromises)
        const validDefenses = defensesData.filter((d): d is Defense => d !== null)
        setDefenses(validDefenses)
      } else {
        setDefenses([])
      }
    } catch (err) {
      console.error("Error fetching student with defenses:", err)
      setError("Erro ao carregar dados do estudante")
      setStudent(null)
      setDefenses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [registration, fetchDefenses])

  return {
    student,
    defenses,
    loading,
    error,
    refetch: fetchData,
  }
}
