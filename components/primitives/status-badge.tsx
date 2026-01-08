import { cn } from "@/lib/utils"
import type { DocumentStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: DocumentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    aprovado: "bg-accent/10 text-accent border-accent/20",
    inativo: "bg-muted text-muted-foreground border-border",
  }

  const labels = {
    pendente: "Pendente",
    aprovado: "Aprovado",
    inativo: "Inativo",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  )
}
