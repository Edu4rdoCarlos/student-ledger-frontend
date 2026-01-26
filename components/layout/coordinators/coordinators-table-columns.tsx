"use client";

import type { ReactNode } from "react";
import { GraduationCap, User } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Coordinator } from "@/lib/types";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export function getCoordinatorColumns(): Column<Coordinator>[] {
  return [
    {
      key: "name",
      label: "Nome",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true;
        return (
          <div className={`flex items-center gap-3 ${!isActive ? "opacity-50" : ""}`}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-primary/10 dark:bg-primary/20" : "bg-muted"}`}
            >
              <User
                className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className={`font-semibold ${!isActive ? "text-muted-foreground" : ""}`}>
                {coordinator.name}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true;
        return (
          <span className={`text-sm text-muted-foreground ${!isActive ? "opacity-50" : ""}`}>
            {coordinator.email}
          </span>
        );
      },
    },
    {
      key: "course",
      label: "Curso",
      render: (coordinator: Coordinator) => {
        const isActive = coordinator.isActive ?? true;

        if (!coordinator.course) {
          return (
            <span className={`text-sm text-muted-foreground italic ${!isActive ? "opacity-50" : ""}`}>
              Sem curso atribuído
            </span>
          );
        }

        const courseDisplay = `${coordinator.course.name} (${coordinator.course.code})`;

        return (
          <div className={`flex items-center gap-2 ${!isActive ? "opacity-50" : ""}`} title={courseDisplay}>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${!isActive ? "text-muted-foreground" : ""}`}>
                {coordinator.course.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {coordinator.course.code}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (coordinator: Coordinator) => (
        <StatusBadge isActive={coordinator.isActive ?? true} />
      ),
    },
  ];
}
