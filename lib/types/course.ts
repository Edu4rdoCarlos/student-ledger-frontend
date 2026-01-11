import type { Department } from "./department"
import type { BaseUser } from "./user"

export interface Course {
  id: string
  code: string
  name: string
  department: Department
  coordinator: BaseUser
  createdAt: string
  updatedAt: string
}
