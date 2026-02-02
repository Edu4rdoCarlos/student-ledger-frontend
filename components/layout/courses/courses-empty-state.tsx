"use client";

import { Book, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/shared/card";
import { Button } from "@/components/primitives/button";

interface CoursesEmptyStateProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

export function CoursesEmptyState({ canCreate, onCreateClick }: CoursesEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Book className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Não há cursos cadastrados no sistema.
        </p>
        {canCreate && (
          <Button className="mt-4 cursor-pointer" onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Curso
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
