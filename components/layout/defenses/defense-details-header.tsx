"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { DefenseStatusBadge, DefenseResultBadge } from "./defense-status-badge";
import type { Defense } from "@/lib/types/defense";

interface DefenseDetailsHeaderProps {
  defense: Defense;
  onBack: () => void;
}

export function DefenseDetailsHeader({ defense, onBack }: DefenseDetailsHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/defenses"
            className="hover:text-foreground transition-colors"
          >
            Defesas
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Detalhes</span>
        </nav>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-3">{defense.title}</h1>
        <div className="flex flex-wrap gap-2">
          <DefenseStatusBadge status={defense.status} size="md" />
          {defense.result === "APPROVED" && (
            <DefenseResultBadge result="APPROVED" size="md" />
          )}
          {defense.result === "FAILED" && (
            <DefenseResultBadge result="FAILED" size="md" />
          )}
        </div>
      </div>
    </>
  );
}
