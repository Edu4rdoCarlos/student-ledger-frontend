"use client";

import { Book, Plus } from "lucide-react";
import { Button } from "@/components/primitives/button";

interface CoursesHeaderProps {
  onAddClick?: () => void;
  showAddButton: boolean;
}

export function CoursesHeader({ onAddClick, showAddButton }: CoursesHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cursos</h1>
        <p className="text-muted-foreground">
          Gerencie os cursos do sistema
        </p>
      </div>
      {showAddButton && onAddClick && (
        <Button className="cursor-pointer" onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      )}
    </div>
  );
}
