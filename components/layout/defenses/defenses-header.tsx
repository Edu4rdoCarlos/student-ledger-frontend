"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/primitives/button";

interface DefensesHeaderProps {
  showAddButton: boolean;
  onAddClick: () => void;
}

export function DefensesHeader({ showAddButton, onAddClick }: DefensesHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Defesas de TCC</h1>
        <p className="text-muted-foreground">
          Acompanhe as defesas de TCC e visualize os documentos relacionados
        </p>
      </div>
      {showAddButton && (
        <Button className="cursor-pointer" onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Defesa
        </Button>
      )}
    </div>
  );
}
