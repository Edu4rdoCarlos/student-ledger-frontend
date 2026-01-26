"use client";

import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

interface AdvisorsHeaderProps {
  onAddClick: () => void;
}

export function AdvisorsHeader({ onAddClick }: AdvisorsHeaderProps) {
  return (
    <PageHeader
      icon={GraduationCap}
      title="Orientadores"
      description="Gerencie os orientadores cadastrados no sistema"
      buttonLabel="Novo Orientador"
      onButtonClick={onAddClick}
    />
  );
}
