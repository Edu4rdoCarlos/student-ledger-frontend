"use client";

import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { LoadingState } from "@/components/shared/loading-state";

interface Student {
  id: string;
  name: string;
  email: string;
  registration: string;
}

interface ExamBoardMember {
  id: string;
  name: string;
  email: string;
}

interface Defense {
  id: string;
  title: string;
  defenseDate: string;
  result: string;
  finalGrade?: number;
  location?: string;
  students?: Student[];
  examBoard?: ExamBoardMember[];
}

interface AdvisorDefensesTabProps {
  defenses: Defense[];
  loading: boolean;
}

interface DefenseCardProps {
  defense: Defense;
}

function getDefenseStatusIcon(result: string) {
  switch (result) {
    case "APPROVED":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "FAILED":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
}

function getDefenseStatusText(result: string) {
  switch (result) {
    case "APPROVED":
      return "Aprovado";
    case "FAILED":
      return "Reprovado";
    default:
      return "Pendente";
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">Nenhuma defesa registrada</p>
    </div>
  );
}

function DefenseCard({ defense }: DefenseCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <h4 className="font-semibold text-base">{defense.title}</h4>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(defense.defenseDate)}
            </div>
            {defense.result !== "PENDING" && defense.finalGrade && (
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Nota: {defense.finalGrade}
              </div>
            )}
            {defense.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {defense.location}
              </div>
            )}
            {defense.students && defense.students.length > 1 && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium">Defesa Compartilhada</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getDefenseStatusIcon(defense.result)}
          <span className="text-sm font-medium">
            {getDefenseStatusText(defense.result)}
          </span>
        </div>
      </div>

      {defense.students && defense.students.length > 0 && (
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Alunos ({defense.students.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {defense.students.map((student) => (
              <div key={student.id} className="flex items-center gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-muted-foreground">
                    {student.email} - {student.registration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {defense.examBoard && defense.examBoard.length > 0 && (
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Banca Examinadora ({defense.examBoard.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {defense.examBoard.map((member) => (
              <div key={member.id} className="flex items-center gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdvisorDefensesTab({
  defenses,
  loading,
}: AdvisorDefensesTabProps) {
  if (loading) return <LoadingState message="Carregando defesas..." />;
  if (defenses.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {defenses.map((defense) => (
        <DefenseCard key={defense.id} defense={defense} />
      ))}
    </div>
  );
}
