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

  const filteredCourses = useMemo(() => {
    if (!user) return courses

    if (isCoordinator(user)) {
      if (user.metadata.coordinator.courses && user.metadata.coordinator.courses.length > 0) {
        const coordinatorCourseCodes = user.metadata.coordinator.courses
          .filter(c => c.active)
          .map(c => c.code)

        return courses.filter(course => coordinatorCourseCodes.includes(course.code))
      }

      return courses.filter(course => course.coordinator?.id === user.id)
    }

    return courses
  }, [courses, user])

  return {
    courses: filteredCourses,
    metadata,
    loading,
    error,
    refetch: fetchCourses,
  }
}
