import type { User } from "./user"

export interface CourseBasic {
  code: string
  name: string
  active: boolean
}

export interface Course {
  id: string
  code: string
  name: string
  active: boolean
  coordinator?: User & { course: CourseBasic | null }
  createdAt: string
  updatedAt: string
}
