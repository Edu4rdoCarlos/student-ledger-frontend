import { useMemo } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { getUserCapabilities, getUserInfo } from "@/lib/helpers/user-capabilities"
import { getNavigationItems, getQuickActions } from "@/lib/config/navigation"
import { getRoleConfig } from "@/lib/config/roles"

export function useUserRole() {
  const user = useAuthStore((state) => state.user)

  const roleConfig = useMemo(() => {
    if (!user) return null
    return getRoleConfig(user.role)
  }, [user])

  const capabilities = useMemo(() => {
    if (!user) return null
    return getUserCapabilities(user)
  }, [user])

  const userInfo = useMemo(() => {
    if (!user) return null
    return getUserInfo(user)
  }, [user])

  const navigation = useMemo(() => {
    if (!user) return []
    return getNavigationItems(user)
  }, [user])

  const quickActions = useMemo(() => {
    if (!user) return []
    return getQuickActions(user)
  }, [user])

  return {
    user,
    roleConfig,
    capabilities,
    userInfo,
    navigation,
    quickActions,
    isStudent: user?.role === "STUDENT",
    isAdvisor: user?.role === "ADVISOR",
    isCoordinator: user?.role === "COORDINATOR",
    isAdmin: user?.role === "ADMIN",
  }
}

export const useUser = useUserRole
