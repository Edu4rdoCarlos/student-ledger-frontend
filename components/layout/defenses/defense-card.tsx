"use client";

import { Calendar, MapPin, Eye, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/primitives/button";
import { DefenseStatusBadge, DefenseResultBadge } from "./defense-status-badge";
import type { Defense } from "@/lib/types";

interface DefenseCardProps {
  defense: Defense;
  onClick: () => void;
  showPulse?: boolean;
}

export function DefenseCard({ defense, onClick, showPulse = false }: DefenseCardProps) {
  return (
    <Card
      className={`hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${showPulse ? "animate-pulse-shadow" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{defense.title}</CardTitle>
        <div className="flex items-center gap-2 mt-2 text-[10px]">
          <span className="font-medium text-muted-foreground uppercase tracking-wide">Status:</span>
          <DefenseStatusBadge status={defense.status} />
          {(defense.result === "APPROVED" || defense.result === "FAILED") && (
            <>
              <span className="text-muted-foreground/30">|</span>
              <span className="font-medium text-muted-foreground uppercase tracking-wide">Resultado:</span>
              <DefenseResultBadge result={defense.result} />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end h-full space-y-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(defense.defenseDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {defense.course && (
            <div className="flex items-center gap-2 text-sm">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{defense.course.name}</span>
            </div>
          )}

          {defense.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{defense.location}</span>
            </div>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
