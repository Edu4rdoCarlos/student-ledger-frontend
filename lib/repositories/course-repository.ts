import type { Course, PaginationMetadata } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

export interface CreateCourseData {
  code: string
  name: string
  active?: boolean
  coordinatorId?: string
}

export interface UpdateCourseData {
  name: string
  active?: boolean
  coordinatorId?: string
}

export interface CourseResponse {
  data: Course
}

export interface PaginatedCoursesResponse {
  data: Course[]
  metadata: PaginationMetadata
}

export interface CourseRepository {
  getAll(page?: number, perPage?: number): Promise<PaginatedCoursesResponse>
  getCourseById(id: string): Promise<CourseResponse>
  createCourse(data: CreateCourseData): Promise<CourseResponse>
  updateCourse(id: string, data: UpdateCourseData): Promise<CourseResponse>
}

export const courseRepository: CourseRepository = {
  async getAll(page = 1, perPage = 100) {
    return apiClient.get<PaginatedCoursesResponse>(
      `/courses?page=${page}&perPage=${perPage}`
    )
  },

  async getCourseById(id: string) {
    return apiClient.get<CourseResponse>(`/courses/${id}`)
  },

  async createCourse(data: CreateCourseData) {
    return apiClient.post<CourseResponse>(`/courses`, data)
  },

  async updateCourse(id: string, data: UpdateCourseData) {
    return apiClient.put<CourseResponse>(`/courses/${id}`, data)
  },
}
