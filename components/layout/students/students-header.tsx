"use client";

import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

interface StudentsHeaderProps {
  onAddClick: () => void;
}

export function StudentsHeader({ onAddClick }: StudentsHeaderProps) {
  return (
    <PageHeader
      icon={GraduationCap}
      title="Alunos"
      description="Gerencie os alunos cadastrados no sistema"
      buttonLabel="Novo Aluno"
      onButtonClick={onAddClick}
    />
  );
}
