import { courseRepository } from "@/lib/repositories/course-repository"

export const courseService = {
  async getAllCourses(page = 1, perPage = 100) {
    return courseRepository.getAll(page, perPage)
  },
}
