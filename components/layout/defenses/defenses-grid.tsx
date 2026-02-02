"use client";

import type { Defense } from "@/lib/types";
import { DefenseCard } from "./defense-card";

interface DefensesGridProps {
  defenses: Defense[];
  onViewDetails: (defense: Defense) => void;
  canCreateDefense: boolean;
  scrollable?: boolean;
}

export function DefensesGrid({
  defenses,
  onViewDetails,
  canCreateDefense,
  scrollable = false,
}: DefensesGridProps) {
  const content = (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {defenses.map((defense) => {
        const canFinalize = defense.status === "SCHEDULED" && new Date(defense.defenseDate) <= new Date();
        const showPulse = canFinalize && canCreateDefense;

        return (
          <DefenseCard
            key={defense.id}
            defense={defense}
            onClick={() => onViewDetails(defense)}
            showPulse={showPulse}
          />
        );
      })}
    </div>
  );

  if (scrollable) {
    return (
      <div className="max-h-[500px] overflow-y-auto pr-2">
        {content}
      </div>
    );
  }

  return content;
}
