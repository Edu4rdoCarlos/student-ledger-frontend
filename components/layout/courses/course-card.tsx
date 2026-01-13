"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shared/card"
import { Button } from "@/components/primitives/button"
import { Badge } from "@/components/primitives/badge"
import { Book, User, Eye, Pencil } from "lucide-react"
import type { Course } from "@/lib/types"

interface CourseCardProps {
  course: Course
  onViewDetails: (course: Course) => void
  onEdit?: (course: Course) => void
  canEdit?: boolean
}

export function CourseCard({ course, onViewDetails, onEdit, canEdit = false }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base break-words">{course.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">{course.code}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {course.coordinator ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">{course.coordinator.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="italic">Sem coordenador</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer"
          onClick={() => onViewDetails(course)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Detalhes
        </Button>
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => onEdit(course)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
