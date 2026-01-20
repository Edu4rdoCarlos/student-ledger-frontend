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

export function getUserCapabilities(user: User) {
  return {
    permissions: getUserPermissions(user),
    can: (permission: Permission) => userCan(user, permission),
  }
}

export function getUserInfo(user: User) {
  if (isStudent(user)) {
    return { type: "student" as const }
  }

  if (isAdvisor(user)) {
    return { type: "advisor" as const }
  }

  if (isCoordinator(user)) {
    return { type: "coordinator" as const }
  }

  return { type: "admin" as const }
}

export function canAccessDefense(user: User, _defenseId: string): boolean {
  return isAdmin(user) || isCoordinator(user) || isAdvisor(user) || isStudent(user)
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
