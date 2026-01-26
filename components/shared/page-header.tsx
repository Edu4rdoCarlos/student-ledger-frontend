"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        onClick={onButtonClick}
        className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
