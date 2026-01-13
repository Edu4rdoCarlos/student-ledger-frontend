import type { BaseUser } from "./user"

export interface CourseBasic {
  code: string
  name: string
  active: boolean
}

export interface Course {
  id: string
  code: string
  name: string
  coordinator?: BaseUser & { course: CourseBasic | null }
  createdAt: string
  updatedAt: string
}
