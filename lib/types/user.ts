export type UserRole = "ADMIN" | "COORDINATOR" | "ADVISOR" | "STUDENT"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isFirstAccess: boolean
  courseId?: string
}

export function isStudent(user: User): boolean {
  return user.role === "STUDENT"
}

export function isAdvisor(user: User): boolean {
  return user.role === "ADVISOR"
}

export function isCoordinator(user: User): boolean {
  return user.role === "COORDINATOR"
}

export function isAdmin(user: User): boolean {
  return user.role === "ADMIN"
}
