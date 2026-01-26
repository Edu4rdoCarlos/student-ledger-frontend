"use client";

import { Button } from "@/components/primitives/button";
import { GraduationCap, Plus } from "lucide-react";

interface StudentsHeaderProps {
  onAddClick: () => void;
}

export function StudentsHeader({ onAddClick }: StudentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Alunos</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie os alunos cadastrados no sistema
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Novo Aluno
      </Button>
    </div>
  );
}
