import type { Course, PaginationMetadata } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface PaginatedCoursesResponse {
  data: Course[]
  metadata: PaginationMetadata
}

export interface CourseRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedCoursesResponse>
}

export const courseRepository: CourseRepository = {
  async getAll(page = 1, perPage = 100) {
    return apiClient.get<PaginatedCoursesResponse>(
      `/courses?page=${page}&perPage=${perPage}`
    )
  },
}
