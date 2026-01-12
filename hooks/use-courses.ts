import { useState, useEffect, useMemo } from "react"
import { courseService } from "@/lib/services/course-service"
import type { Course, PaginationMetadata } from "@/lib/types"
import { useUserRole } from "@/lib/hooks/use-user-role"
import { isCoordinator } from "@/lib/types/user"

export function useCourses(page = 1, perPage = 100) {
  const { user } = useUserRole()
  const [courses, setCourses] = useState<Course[]>([])
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await courseService.getAllCourses(page, perPage)
      setCourses(response.data)
      setMetadata(response.metadata)
    } catch (err) {
      setError(err as Error)
      console.error("Erro ao buscar cursos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [page, perPage])

  const myCourses = useMemo(() => {
    if (!user) return []

    return courses.filter(course => course.coordinator?.email === user.email)
  }, [courses, user])

  return {
    courses,
    myCourses,
    metadata,
    loading,
    error,
    refetch: fetchCourses,
  }
}
