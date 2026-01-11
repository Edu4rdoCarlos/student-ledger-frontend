import type { User } from "@/lib/types"
import { isStudent, isAdvisor, isCoordinator, isAdmin } from "@/lib/types"

export type Permission =
  | "view_defenses"
  | "create_defense"
  | "edit_defense"
  | "cancel_defense"
  | "upload_document"
  | "approve_document"
  | "manage_students"
  | "manage_advisors"
  | "manage_coordinators"
  | "manage_courses"
  | "manage_departments"
  | "submit_results"
  | "view_all_data"

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    "view_defenses",
    "create_defense",
    "edit_defense",
    "cancel_defense",
    "upload_document",
    "approve_document",
    "manage_students",
    "manage_advisors",
    "manage_coordinators",
    "manage_courses",
    "manage_departments",
    "submit_results",
    "view_all_data",
  ],
  coordinator: [
    "view_defenses",
    "create_defense",
    "edit_defense",
    "cancel_defense",
    "upload_document",
    "manage_students",
    "manage_advisors",
    "submit_results",
  ],
  advisor: ["view_defenses", "upload_document"],
  student: ["view_defenses", "approve_document"],
}

export function getUserPermissions(user: User): Permission[] {
  if (isAdmin(user)) return ROLE_PERMISSIONS.admin
  if (isCoordinator(user)) return ROLE_PERMISSIONS.coordinator
  if (isAdvisor(user)) return ROLE_PERMISSIONS.advisor
  if (isStudent(user)) return ROLE_PERMISSIONS.student
  return []
}

export function userCan(user: User, permission: Permission): boolean {
  const permissions = getUserPermissions(user)
  return permissions.includes(permission)
}

export function getUserInfo(user: User) {
  if (isStudent(user)) {
    return {
      type: "student" as const,
      registration: user.metadata.student?.registration,
      course: user.metadata.student?.course,
      defenses: user.metadata.student?.defenses || [],
    }
  }

  if (isAdvisor(user)) {
    return {
      type: "advisor" as const,
      specialization: user.metadata.advisor?.specialization,
      department: user.metadata.advisor?.department,
      course: user.metadata.advisor?.course,
      defenses: user.metadata.advisor?.defenses || [],
    }
  }

  if (isCoordinator(user)) {
    return {
      type: "coordinator" as const,
      isActive: user.metadata.coordinator?.isActive,
      course: user.metadata.coordinator?.course,
      department: user.metadata.coordinator?.department,
    }
  }

  return {
    type: "admin" as const,
  }
}

export function canAccessDefense(user: User, defenseId: string): boolean {
  if (isAdmin(user)) {
    return true
  }

  const userInfo = getUserInfo(user)

  if (userInfo.type === "student" || userInfo.type === "advisor") {
    return userInfo.defenses?.some((d) => d.id === defenseId) || false
  }

  return true
}

export function canManageUser(user: User, targetUserId: string): boolean {
  if (isAdmin(user)) {
    return true
  }

  if (isCoordinator(user)) {
    return true
  }

  return user.id === targetUserId
}
