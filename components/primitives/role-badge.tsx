import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const variants: Record<UserRole, string> = {
    ADMIN: "bg-primary/10 text-primary border-primary/20",
    COORDINATOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ADVISOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    STUDENT: "bg-muted text-muted-foreground border-border",
  }

  const labels: Record<UserRole, string> = {
    ADMIN: "Administrador",
    COORDINATOR: "Coordenador",
    ADVISOR: "Orientador",
    STUDENT: "Aluno",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[role],
        className,
      )}
    >
      {labels[role]}
    </span>
  )
}
