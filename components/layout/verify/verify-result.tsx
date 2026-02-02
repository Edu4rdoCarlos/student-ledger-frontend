"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Lock,
  User,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/shared/card";
import type { DocumentValidationResponse } from "@/lib/types";

interface VerifyResultProps {
  result: DocumentValidationResponse;
  onReset: () => void;
}

interface DocumentInfoProps {
  document: NonNullable<DocumentValidationResponse["document"]>;
  variant: "success" | "warning";
}

function ResultHeader({
  icon,
  title,
  description,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "success" | "warning" | "error";
}) {
  const styles = {
    success: {
      bg: "from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30",
      title: "text-emerald-700 dark:text-emerald-400",
    },
    warning: {
      bg: "from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30",
      title: "text-amber-700 dark:text-amber-400",
    },
    error: {
      bg: "from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30",
      title: "text-red-700 dark:text-red-400",
    },
  };

  const style = styles[variant];

  return (
    <div className="flex flex-col items-center space-y-4 text-center pb-6 border-b border-border/50">
      <div className={`rounded-2xl bg-gradient-to-br ${style.bg} p-6 shadow-lg`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-2xl font-bold mb-2 ${style.title}`}>{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  variant = "default",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  variant?: "default" | "success" | "warning";
}) {
  const styles = {
    default: "bg-primary/5 dark:bg-primary/10 border-border/50",
    success:
      "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/30",
    warning:
      "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30",
  };

  const labelStyles = {
    default: "text-muted-foreground",
    success: "text-emerald-900 dark:text-emerald-100",
    warning: "text-amber-900 dark:text-amber-100",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-emerald-800 dark:text-emerald-200",
    warning: "text-amber-800 dark:text-amber-200",
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[variant]}`}>
      {icon && (
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className={`text-xs font-medium ${labelStyles[variant]}`}>{label}</p>
        </div>
      )}
      {!icon && (
        <p className={`text-xs font-medium ${labelStyles[variant]} mb-1`}>{label}</p>
      )}
      <p className={`font-semibold ${valueStyles[variant]}`}>{value}</p>
    </div>
  );
}

function HashCard({
  hash,
  variant,
}: {
  hash: string;
  variant: "success" | "warning";
}) {
  const styles = {
    success: {
      container:
        "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      label: "text-emerald-900 dark:text-emerald-100",
      value:
        "text-emerald-800 dark:text-emerald-200 bg-emerald-100/50 dark:bg-emerald-950/30",
    },
    warning: {
      container:
        "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30",
      icon: "text-amber-600 dark:text-amber-400",
      label: "text-amber-900 dark:text-amber-100",
      value:
        "text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-950/30",
    },
  };

  const style = styles[variant];

  return (
    <div className={`p-4 rounded-xl border ${style.container}`}>
      <div className="flex items-center gap-2 mb-2">
        <Lock className={`h-4 w-4 ${style.icon}`} />
        <p className={`text-xs font-medium ${style.label}`}>Hash SHA-256</p>
      </div>
      <p className={`break-all text-xs ${style.value} p-2 rounded`}>{hash}</p>
    </div>
  );
}

function DocumentInfo({ document, variant }: DocumentInfoProps) {
  const iconStyles = {
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  const hash =
    document.documentType === "minutes"
      ? document.minutesHash
      : document.evaluationHash;

  return (
    <div className="space-y-4">
      {document.defenseInfo?.students && document.defenseInfo.students.length > 0 && (
        <InfoCard
          icon={<User className="h-4 w-4 text-primary" />}
          label="Aluno(s)"
          value={document.defenseInfo.students.join(", ") || "Não informado"}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {document.defenseInfo?.advisor && (
          <InfoCard
            icon={<GraduationCap className="h-4 w-4 text-primary" />}
            label="Orientador"
            value={document.defenseInfo.advisor || "Não informado"}
          />
        )}

        {document.defenseInfo?.course && (
          <InfoCard label="Curso" value={document.defenseInfo.course || "Não informado"} />
        )}
      </div>

      <InfoCard
        icon={<FileText className={`h-4 w-4 ${iconStyles[variant]}`} />}
        label="Tipo de Documento"
        value={document.documentType === "minutes" ? "Ata" : "Avaliação de Desempenho"}
        variant={variant}
      />

      {hash && <HashCard hash={hash} variant={variant} />}
    </div>
  );
}

function NotFoundResult({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center py-8">
      <div className="rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 p-6 shadow-lg">
        <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">
          Documento Não Encontrado
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Este documento não foi submetido ao sistema. Possível documento fraudulento.
        </p>
      </div>
      <Button onClick={onReset} variant="outline" className="mt-4">
        <RotateCcw className="h-4 w-4 mr-2" />
        Nova Verificação
      </Button>
    </div>
  );
}

function PendingResult({
  result,
  onReset,
}: {
  result: DocumentValidationResponse;
  onReset: () => void;
}) {
  const isInactive = result.status === "INACTIVE";

  return (
    <div className="space-y-6">
      <ResultHeader
        icon={<Clock className="h-12 w-12 text-amber-600 dark:text-amber-400" />}
        title={isInactive ? "Documento Inativo" : "Documento Pendente"}
        description={
          isInactive
            ? "Este documento foi inativado e não está mais válido"
            : "Documento pendente de assinatura"
        }
        variant="warning"
      />

      {result.document && <DocumentInfo document={result.document} variant="warning" />}

      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Nova Verificação
      </Button>
    </div>
  );
}

function ApprovedResult({
  result,
  onReset,
}: {
  result: DocumentValidationResponse;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <ResultHeader
        icon={<CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />}
        title="Documento Autêntico"
        description="O documento foi verificado e está registrado na blockchain"
        variant="success"
      />

      {result.document && <DocumentInfo document={result.document} variant="success" />}

      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        Nova Verificação
      </Button>
    </div>
  );
}

export function VerifyResult({ result, onReset }: VerifyResultProps) {
  return (
    <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <CardContent className="pt-6">
        {result.status === "NOT_FOUND" && <NotFoundResult onReset={onReset} />}

        {(result.status === "PENDING" || result.status === "INACTIVE") && (
          <PendingResult result={result} onReset={onReset} />
        )}

        {result.status === "APPROVED" && (
          <ApprovedResult result={result} onReset={onReset} />
        )}
      </CardContent>
    </Card>
  );
}
