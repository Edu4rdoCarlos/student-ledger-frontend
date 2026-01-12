import type { Department } from "./department"
import type { BaseUser } from "./user"

export interface Course {
  id: string
  code: string
  name: string
  description?: string
  duration?: number
  website?: string
  department: Department
  coordinator?: BaseUser & { phone?: string }
  createdAt: string
  updatedAt: string
}
