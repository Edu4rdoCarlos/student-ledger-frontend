"use client"

import { useState, useEffect } from "react"
import { studentService } from "@/lib/services/student-service"
import type { Student } from "@/lib/types"

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAllStudents()
      setStudents(data)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar alunos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createStudent = async (data: any) => {
    try {
      const newStudent = await studentService.createStudent(data)
      setStudents((prev) => [...prev, newStudent])
      return newStudent
    } catch (err) {
      setError("Erro ao criar aluno")
      throw err
    }
  }

  return {
    students,
    loading,
    error,
    refetch: loadStudents,
    createStudent,
  }
}
