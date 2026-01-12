"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/primitives/button"
import type { PaginationMetadata } from "@/lib/types"

interface TablePaginationProps {
  metadata: PaginationMetadata
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function TablePagination({ metadata, onPageChange, disabled = false }: TablePaginationProps) {
  const { page, totalPages, total, perPage } = metadata

  const showingFrom = (page - 1) * perPage + 1
  const showingTo = Math.min(page * perPage, total)

  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <div className="flex items-center justify-between gap-4 px-2 py-4 border-t border-border/50">
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{showingFrom}</span> a{" "}
        <span className="font-medium text-foreground">{showingTo}</span> de{" "}
        <span className="font-medium text-foreground">{total}</span> resultados
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={disabled || !canGoPrevious}
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
          title="Primeira página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || !canGoPrevious}
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/50">
          <span className="text-sm font-medium text-foreground">{page}</span>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canGoNext}
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
          title="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || !canGoNext}
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
