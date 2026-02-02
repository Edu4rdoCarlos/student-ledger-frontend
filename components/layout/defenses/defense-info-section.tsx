"use client";

import { Calendar, Users } from "lucide-react";
import type { Defense } from "@/lib/types/defense";

interface DefenseInfoSectionProps {
  defense: Defense;
}

export function DefenseInfoSection({ defense }: DefenseInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Informações da Defesa</h3>
        </div>
        <div className="space-y-2 text-sm">
          {defense.course && (
            <div>
              <p className="text-muted-foreground">Curso</p>
              <p className="font-medium text-primary">{defense.course.name}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Data e Hora</p>
            <p className="font-medium">
              {new Date(defense.defenseDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {defense.location && (
            <div>
              <p className="text-muted-foreground">Local</p>
              <p className="font-medium">{defense.location}</p>
            </div>
          )}
          {defense.finalGrade !== undefined && (
            <div>
              <p className="text-muted-foreground">Nota Final</p>
              <p className="font-medium">{defense.finalGrade}</p>
            </div>
          )}
        </div>
      </div>

      {defense.advisor && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Orientador</h3>
          </div>
          <div className="text-sm p-3 rounded-lg border bg-muted/50">
            <p className="font-medium">{defense.advisor.name}</p>
            <p className="text-muted-foreground text-xs">{defense.advisor.email}</p>
            {defense.advisor.specialization && (
              <p className="text-muted-foreground text-xs">{defense.advisor.specialization}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
