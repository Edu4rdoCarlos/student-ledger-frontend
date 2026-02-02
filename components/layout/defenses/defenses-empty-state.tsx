"use client";

import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/shared/card";

interface DefensesEmptyStateProps {
  message?: string;
  description?: string;
  compact?: boolean;
}

export function DefensesEmptyState({
  message = "Nenhuma defesa encontrada",
  description = "Não há defesas cadastradas no sistema no momento.",
  compact = false,
}: DefensesEmptyStateProps) {
  return (
    <Card>
      <CardContent className={`flex flex-col items-center justify-center ${compact ? "py-8" : "py-12"}`}>
        <Calendar className={`${compact ? "h-8 w-8 mb-2" : "h-12 w-12 mb-4"} text-muted-foreground`} />
        <h3 className={`${compact ? "text-sm" : "text-lg font-semibold"} mb-2`}>{message}</h3>
        <p className="text-muted-foreground text-center max-w-md text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
