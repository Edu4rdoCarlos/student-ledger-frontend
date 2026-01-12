"use client"

import { useState, useEffect } from "react"
import { studentService } from "@/lib/services/student-service"
import type { Student, PaginationMetadata } from "@/lib/types"

export function useStudents(page = 1, perPage = 10) {
  const [students, setStudents] = useState<Student[]>([])
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStudents(page, perPage)
  }, [page, perPage])

  const loadStudents = async (currentPage = 1, currentPerPage = 10) => {
    try {
      setLoading(true)
      const response = await studentService.getAllStudents(currentPage, currentPerPage)
      setStudents(response.data)
      setMetadata(response.metadata)
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
    metadata,
    loading,
    error,
    refetch: loadStudents,
    createStudent,
  }
}
