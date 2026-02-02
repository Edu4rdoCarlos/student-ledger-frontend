"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";

type DefenseStatus = "SCHEDULED" | "COMPLETED" | "CANCELED";
type DefenseResult = "APPROVED" | "FAILED" | "PENDING";

interface DefenseStatusBadgeProps {
  status: DefenseStatus;
  size?: "sm" | "md";
}

interface DefenseResultBadgeProps {
  result: DefenseResult;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
};

const iconSizes = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
};

export function DefenseStatusBadge({ status, size = "sm" }: DefenseStatusBadgeProps) {
  const baseClasses = `inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`;

  if (status === "SCHEDULED") {
    return (
      <span className={`${baseClasses} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400`}>
        <Clock className={iconSizes[size]} />
        Agendada
      </span>
    );
  }

  if (status === "COMPLETED") {
    return (
      <span className={`${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400`}>
        <CheckCircle2 className={iconSizes[size]} />
        Concluída
      </span>
    );
  }

  if (status === "CANCELED") {
    return (
      <span className={`${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`}>
        <XCircle className={iconSizes[size]} />
        Cancelada
      </span>
    );
  }

  return null;
}

export function DefenseResultBadge({ result, size = "sm" }: DefenseResultBadgeProps) {
  const baseClasses = `inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`;

  if (result === "APPROVED") {
    return (
      <span className={`${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400`}>
        <CheckCircle2 className={iconSizes[size]} />
        Aprovado
      </span>
    );
  }

  if (result === "FAILED") {
    return (
      <span className={`${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`}>
        <XCircle className={iconSizes[size]} />
        Reprovado
      </span>
    );
  }

  return null;
}
