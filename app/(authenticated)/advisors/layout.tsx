"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { isAdmin, isCoordinator } from "@/lib/types/user"
import { AccessDenied } from "@/components/shared/access-denied"

export default function AdvisorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((state) => state.user)

  if (!user || (!isAdmin(user) && !isCoordinator(user))) {
    return <AccessDenied />
  }

  return <>{children}</>
}
