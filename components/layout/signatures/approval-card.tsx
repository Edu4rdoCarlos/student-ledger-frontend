"use client";

import {
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/primitives/button";
import { getRoleLabel } from "@/lib/utils/role-utils";
import type { PendingApproval } from "@/hooks/use-approvals";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ApprovalCardProps {
  approval: PendingApproval;
  status: ApprovalStatus;
  userId?: string;
  userRole?: string;
  onCardClick: (approval: PendingApproval) => void;
  onEvaluate: (approval: PendingApproval) => void;
  onReconsider: (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => void;
  onNewVersion: (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => void;
}

const statusColors = {
  PENDING: {
    bg: "from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900/50 dark:to-orange-950/20",
    border: "border-amber-400 dark:border-amber-600",
    text: "text-amber-700 dark:text-amber-400",
    icon: Clock,
  },
  APPROVED: {
    bg: "from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-slate-900/50 dark:to-teal-950/20",
    border: "border-emerald-400 dark:border-emerald-600",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle,
  },
  REJECTED: {
    bg: "from-red-50/50 via-white to-rose-50/30 dark:from-red-950/20 dark:via-slate-900/50 dark:to-rose-950/20",
    border: "border-red-400 dark:border-red-600",
    text: "text-red-700 dark:text-red-400",
    icon: XCircle,
  },
};

function ApprovalCardHeader({
  approval,
  status,
  pendingRoles,
  config,
}: {
  approval: PendingApproval;
  status: ApprovalStatus;
  pendingRoles: string;
  config: (typeof statusColors)[ApprovalStatus];
}) {
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col-reverse items-start justify-between gap-3">
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-start gap-2">
          <FileText className={`h-4 w-4 ${config.text} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold text-foreground group-hover:${config.text} transition-colors line-clamp-2`}
            >
              {approval.documentTitle}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {approval.courseName}
            </p>
          </div>
        </div>

        {approval.students.length > 0 && (
          <div className="flex items-start gap-1.5 pl-6 w-full">
            <User className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground flex-1">
              {approval.students.map((s) => s.name).join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col m-0 ml-auto items-end gap-2">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md bg-${
            status === "PENDING"
              ? "amber"
              : status === "APPROVED"
              ? "emerald"
              : "red"
          }-100 dark:bg-${
            status === "PENDING"
              ? "amber"
              : status === "APPROVED"
              ? "emerald"
              : "red"
          }-900/30`}
        >
          <StatusIcon className={`h-3 w-3 ${config.text}`} />
          <span className={`text-xs font-medium ${config.text}`}>
            {status === "PENDING"
              ? pendingRoles
              : status === "APPROVED"
              ? "Aprovado"
              : "Rejeitado"}
          </span>
        </div>
      </div>
    </div>
  );
}

function PendingCardFooter({
  approvedCount,
  totalSignatures,
  canEvaluate,
  hasMyPendingApproval,
  isCoordinator,
  hasRejection,
  allOthersApproved,
  onEvaluate,
}: {
  approvedCount: number;
  totalSignatures: number;
  canEvaluate: boolean;
  hasMyPendingApproval: boolean;
  isCoordinator: boolean;
  hasRejection: boolean;
  allOthersApproved: boolean;
  onEvaluate: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pl-6">
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(approvedCount / totalSignatures) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {approvedCount}/{totalSignatures}
        </span>
      </div>
      <div className="pt-2 border-t space-y-2">
        {isCoordinator && hasRejection && (
          <p className="text-xs text-center text-muted-foreground italic">
            Aguardando resolução da rejeição antes de avaliar
          </p>
        )}
        {isCoordinator && !hasRejection && !allOthersApproved && (
          <p className="text-xs text-center text-muted-foreground italic">
            Aguardando as demais aprovações antes de avaliar
          </p>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEvaluate();
          }}
          disabled={!canEvaluate || !hasMyPendingApproval}
          className="w-full gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Avaliar Documento
        </Button>
      </div>
    </div>
  );
}

function RejectedCardFooter({
  rejectedSignature,
  onReconsider,
  onNewVersion,
}: {
  rejectedSignature: {
    id: string;
    approverName: string;
    role: string;
    justification?: string;
  };
  onReconsider: () => void;
  onNewVersion: () => void;
}) {
  return (
    <div className="pl-6 space-y-3 border-t pt-3">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Rejeitado por:
        </p>
        <p className="text-sm font-medium">{rejectedSignature.approverName}</p>
        <p className="text-xs text-muted-foreground">{rejectedSignature.role}</p>
      </div>
      {rejectedSignature.justification && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Motivo da rejeição:
          </p>
          <p className="text-sm text-muted-foreground italic border-l-2 border-red-400 pl-2">
            &ldquo;{rejectedSignature.justification}&rdquo;
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onReconsider();
          }}
          className="flex-1 gap-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:border-slate-500"
        >
          <RefreshCcw className="h-4 w-4" />
          Reconsiderar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onNewVersion();
          }}
          className="flex-1 gap-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:border-slate-500"
        >
          <Upload className="h-4 w-4" />
          Substituir Documento
        </Button>
      </div>
    </div>
  );
}

export function ApprovalCard({
  approval,
  status,
  userId,
  userRole,
  onCardClick,
  onEvaluate,
  onReconsider,
  onNewVersion,
}: ApprovalCardProps) {
  const signatures = approval.signatures || approval.approvals || [];
  const coordinatorSig = signatures.find((s) => s.role === "COORDINATOR");
  const advisorSig = signatures.find((s) => s.role === "ADVISOR");
  const isCoordinatorAlsoAdvisor = !!(
    coordinatorSig?.approverId &&
    advisorSig?.approverId &&
    coordinatorSig.approverId === advisorSig.approverId
  );

  const displaySignatures = isCoordinatorAlsoAdvisor
    ? signatures.filter((s) => s.role !== "ADVISOR")
    : signatures;

  const approvedCount = signatures.filter((s) => s.status === "APPROVED").length;
  const totalSignatures = displaySignatures.length;
  const pendingRoles = displaySignatures
    .filter((s) => s.status === "PENDING")
    .map((s) => getRoleLabel(s.role, isCoordinatorAlsoAdvisor))
    .join(", ");

  const rejectedSignature = signatures.find((s) => s.status === "REJECTED");
  const myPendingApproval = signatures.find(
    (s) => s.status === "PENDING" && s.approverId === userId
  );

  const hasRejection = !!rejectedSignature;
  const isCoordinator = userRole === "COORDINATOR";

  const otherSignatures = signatures.filter((s) => s.approverId !== userId);
  const allOthersApproved =
    otherSignatures.length === 0 ||
    otherSignatures.every((s) => s.status === "APPROVED");

  const canEvaluate =
    myPendingApproval &&
    !(isCoordinator && hasRejection) &&
    (!isCoordinator || allOthersApproved);

  const config = statusColors[status];

  return (
    <div
      key={approval.id}
      className={`group rounded-xl border border-border/50 bg-gradient-to-br ${config.bg} p-4 transition-all hover:shadow-lg hover:${config.border} hover:scale-[1.02] cursor-pointer`}
    >
      <div className="space-y-3 flex flex-col justify-between h-full">
        <div onClick={() => onCardClick(approval)}>
          <ApprovalCardHeader
            approval={approval}
            status={status}
            pendingRoles={pendingRoles}
            config={config}
          />
        </div>

        {status === "PENDING" && (
          <PendingCardFooter
            approvedCount={approvedCount}
            totalSignatures={totalSignatures}
            canEvaluate={!!canEvaluate}
            hasMyPendingApproval={!!myPendingApproval}
            isCoordinator={isCoordinator}
            hasRejection={hasRejection}
            allOthersApproved={allOthersApproved}
            onEvaluate={() => onEvaluate(approval)}
          />
        )}

        {status === "REJECTED" && rejectedSignature && (
          <RejectedCardFooter
            rejectedSignature={rejectedSignature}
            onReconsider={() =>
              onReconsider(
                rejectedSignature.id,
                approval.documentTitle,
                rejectedSignature.justification || "Sem justificativa",
                rejectedSignature.approverName
              )
            }
            onNewVersion={() =>
              onNewVersion(
                rejectedSignature.id,
                approval.documentTitle,
                rejectedSignature.justification || "Sem justificativa",
                rejectedSignature.approverName
              )
            }
          />
        )}
      </div>
    </div>
  );
}
