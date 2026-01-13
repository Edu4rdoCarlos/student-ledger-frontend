import type { Course } from "./course"
import type { Department } from "./department"

export type UserRole = "ADMIN" | "COORDINATOR" | "ADVISOR" | "STUDENT"

export interface BaseUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface StudentMetadata {
  userId: string
  registration: string
  course: Course
  defenseIds: string[]
}

export interface AdvisorMetadata {
  userId: string
  specialization: string
  department: Department
  course: Course
  defenseIds: string[]
}

export interface CoordinatorMetadata {
  userId: string
  isActive: boolean
  course: Course
  courses?: Array<{ code: string; name: string; active: boolean }>
  department: Department
}

export interface UserMetadata {
  student?: StudentMetadata
  advisor?: AdvisorMetadata
  coordinator?: CoordinatorMetadata
}

export interface User extends BaseUser {
  metadata: UserMetadata
}

export function isStudent(user: User): user is User & { metadata: { student: StudentMetadata } } {
  return user.role === "STUDENT" && !!user.metadata.student
}

export function isAdvisor(user: User): user is User & { metadata: { advisor: AdvisorMetadata } } {
  return user.role === "ADVISOR" && !!user.metadata.advisor
}

export function isCoordinator(user: User): user is User & { metadata: { coordinator: CoordinatorMetadata } } {
  return user.role === "COORDINATOR" && !!user.metadata.coordinator
}

export function isAdmin(user: User): boolean {
  return user.role === "ADMIN"
}
