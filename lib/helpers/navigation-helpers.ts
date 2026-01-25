import type { User, UserRole } from "@/lib/types"

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case "STUDENT":
    case "ADVISOR":
      return "/defenses"
    case "COORDINATOR":
      return "/dashboard"
    case "ADMIN":
      return "/course"
    default:
      return "/dashboard"
  }
}

export function getHomeRouteForUser(user: User): string {
  return getHomeRouteForRole(user.role)
}
