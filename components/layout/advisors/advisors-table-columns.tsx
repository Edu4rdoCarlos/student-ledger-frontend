"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { GraduationCap, User, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Advisor } from "@/lib/types";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface GetColumnsProps {
  currentUserId?: string;
  onViewDetails: (advisor: Advisor) => void;
}

export function getAdvisorColumns({ currentUserId, onViewDetails }: GetColumnsProps): Column<Advisor>[] {
  return [
    {
      key: "name",
      label: "Nome",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true;
        const isCurrentUser = currentUserId === advisor.userId;
        return (
          <div
            className={`flex items-center gap-3 ${!isActive ? "opacity-50" : ""}`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-primary/10 dark:bg-primary/20" : "bg-muted"}`}
            >
              <User
                className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <p
                className={`font-semibold ${!isActive ? "text-muted-foreground" : ""}`}
              >
                {advisor.name}
              </p>
              {isCurrentUser && (
                <Badge
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/30"
                >
                  Você
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true;
        return (
          <span
            className={`text-sm text-muted-foreground ${!isActive ? "opacity-50" : ""}`}
          >
            {advisor.email}
          </span>
        );
      },
    },
    {
      key: "course",
      label: "Curso",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true;
        const courseDisplay = `${advisor.course.name} (${advisor.course.code})`;

        return (
          <div
            className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`}
            title={courseDisplay}
          >
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${!isActive ? "text-muted-foreground" : ""}`}
              >
                {advisor.course.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {advisor.course.code}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "activeAdvisorships",
      label: "Orientações",
      render: (advisor: Advisor) => {
        const isActive = advisor.isActive ?? true;
        const count = advisor.activeAdvisorshipsCount;

        return (
          <div
            className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`}
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {count} {count === 1 ? "orientação" : "orientações"}
            </span>
          </div>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (advisor: Advisor) => (
        <StatusBadge isActive={advisor.isActive ?? true} />
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (advisor: Advisor) => (
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails(advisor)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>
      ),
    },
  ];
}
