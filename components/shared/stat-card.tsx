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
    <Card className="relative overflow-hidden border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 dark:group-hover:from-blue-950/20 dark:group-hover:to-indigo-950/20 transition-all" />

      <CardContent className="relative flex items-start justify-between p-6">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">{description}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 transition-transform ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>

      {/* Bottom accent border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Card>
  )
}
