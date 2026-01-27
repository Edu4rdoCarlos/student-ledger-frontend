import { Card, CardContent } from "@/components/shared/card"
import type { LucideIcon } from "lucide-react"
import { TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  iconColor?: string
}

export function StatCard({ title, value, icon: Icon, description, iconColor = "text-primary" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all group">
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-all" />

      <CardContent className="relative flex items-center justify-between px-4">
        <div className=" flex-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">{description}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:scale-110 transition-transform ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Card>
  )
}
