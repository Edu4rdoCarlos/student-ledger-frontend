import { courseRepository, type CreateCourseData, type UpdateCourseData } from "@/lib/repositories/course-repository"

export const courseService = {
  async getAllCourses(page = 1, perPage = 100) {
    return courseRepository.getAll(page, perPage)
  },

  async getStudentsByCourse(courseId: string) {
    return courseRepository.getStudentsByCourse(courseId)
  },

  async getAdvisorsByCourse(courseId: string) {
    return courseRepository.getAdvisorsByCourse(courseId)
  },

  async createCourse(data: CreateCourseData) {
    return courseRepository.createCourse(data)
  },

  async updateCourse(id: string, data: UpdateCourseData) {
    return courseRepository.updateCourse(id, data)
  },
}
