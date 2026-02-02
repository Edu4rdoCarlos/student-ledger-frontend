"use client";

import { Users } from "lucide-react";
import type { Defense } from "@/lib/types/defense";

interface DefenseParticipantsSectionProps {
  defense: Defense;
}

export function DefenseParticipantsSection({ defense }: DefenseParticipantsSectionProps) {
  return (
    <div className="space-y-4">
      {defense.students && defense.students.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Alunos</h3>
          </div>
          <div className="space-y-2">
            {defense.students.map((student) => (
              <div
                key={student.id}
                className="text-sm p-3 rounded-lg border bg-muted/50"
              >
                <p className="font-medium">{student.name}</p>
                <p className="text-muted-foreground text-xs">{student.email}</p>
                <p className="text-muted-foreground text-xs">
                  Matrícula: {student.registration}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {defense.examBoard && defense.examBoard.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Banca Examinadora</h3>
          </div>
          <div className="space-y-2">
            {defense.examBoard.map((member) => (
              <div
                key={member.id}
                className="text-sm p-3 rounded-lg border bg-muted/50"
              >
                <p className="font-medium">{member.name}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
