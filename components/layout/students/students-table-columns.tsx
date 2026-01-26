"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/primitives/button";
import {
  GraduationCap,
  User,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
} from "lucide-react";
import type { Student } from "@/lib/types";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface GetColumnsProps {
  onViewDetails: (student: Student) => void;
}

function getDefenseStatusBadge(student: Student) {
  const defensesCount = student.defensesCount ?? student.defenseIds?.length ?? 0;
  const defenseStatus = student.defenseStatus;

  if (!defenseStatus || defensesCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400" title="Nenhuma defesa cadastrada">
        <Clock className="h-3 w-3" />
        Sem defesa
      </span>
    );
  }

  if (defenseStatus === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400" title="Defesa concluída">
        <CheckCircle2 className="h-3 w-3" />
        Concluída
      </span>
    );
  }

  if (defenseStatus === "CANCELED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400" title="Defesa cancelada">
        <XCircle className="h-3 w-3" />
        Cancelada
      </span>
    );
  }

  if (defenseStatus === "SCHEDULED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400" title="Defesa agendada">
        <Clock className="h-3 w-3" />
        Agendada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400" title="Status desconhecido">
      <Clock className="h-3 w-3" />
      Desconhecido
    </span>
  );
}

export function getStudentColumns({ onViewDetails }: GetColumnsProps): Column<Student>[] {
  return [
    {
      key: "matricula",
      label: "Matrícula",
      render: (student: Student) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
          {student.registration || student.matricula}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{student.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (student: Student) => (
        <span className="text-sm text-muted-foreground">{student.email}</span>
      ),
    },
    {
      key: "course",
      label: "Curso",
      render: (student: Student) => {
        const courseDisplay = typeof student.course === 'string'
          ? student.course
          : `${student.course.name} (${student.course.code})`;

        return (
          <div className="flex items-center gap-2" title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {typeof student.course === 'string' ? student.course : student.course.name}
              </span>
              {typeof student.course !== 'string' && (
                <span className="text-xs text-muted-foreground">{student.course.code}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "defenses",
      label: "Defesas",
      render: (student: Student) => {
        const defensesCount = student.defensesCount ?? student.defenseIds?.length ?? 0;

        return (
          <div className="flex items-center gap-2" title={defensesCount > 0 ? `${defensesCount} defesa(s) registrada(s)` : 'Nenhuma defesa'}>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{defensesCount}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Progresso do TCC",
      render: (student: Student) => getDefenseStatusBadge(student),
    },
    {
      key: "actions",
      label: "Ações",
      render: (student: Student) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails(student)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      ),
    },
  ];
}
