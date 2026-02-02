"use client";

import { FileText, ArrowRight, CheckCircle, Clock, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { Button } from "@/components/primitives/button";
import Link from "next/link";
import type { PendingApproval } from "@/hooks/use-approvals";

interface PendingApprovalsCardProps {
  approvals: PendingApproval[];
  loading: boolean;
  onApprovalClick: (approval: PendingApproval) => void;
}

function ApprovalItem({
  approval,
  onClick
}: {
  approval: PendingApproval;
  onClick: () => void;
}) {
  const signatures = approval.signatures || approval.approvals || [];
  const approvedCount = signatures.filter((s) => s.status === "APPROVED").length;
  const totalSignatures = signatures.length;
  const pendingRoles = signatures
    .filter((s) => s.status === "PENDING")
    .map((s) => s.role)
    .join(", ");

  return (
    <div
      onClick={onClick}
      className="group rounded-xl border m-2 border-border/50 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900/50 dark:to-orange-950/20 p-4 transition-all hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-600 hover:scale-[1.02] cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start gap-2">
              <FileText className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {approval.documentTitle}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {approval.courseName}
                </p>
              </div>
            </div>

            {approval.students.length > 0 && (
              <div className="flex items-start gap-1.5 pl-5 w-full">
                <User className="h-2.5 w-2.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground flex-1">
                  {approval.students.map((s) => s.name).join(", ")}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-2.5 w-2.5 text-amber-700 dark:text-amber-400" />
              <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">
                {pendingRoles}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-6">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(approvedCount / totalSignatures) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {approvedCount}/{totalSignatures}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApprovalsEmptyState() {
  return (
    <div className="text-center py-8">
      <CheckCircle className="h-12 w-12 mx-auto text-emerald-600/50 mb-3" />
      <p className="text-sm text-muted-foreground">Nenhuma aprovação pendente</p>
    </div>
  );
}

function ApprovalsLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
}

export function PendingApprovalsCard({ approvals, loading, onApprovalClick }: PendingApprovalsCardProps) {
  return (
    <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Aprovações Pendentes
        </CardTitle>
        <CardDescription>Documentos aguardando sua aprovação</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ApprovalsLoading />
        ) : approvals.length === 0 ? (
          <ApprovalsEmptyState />
        ) : (
          <div className="max-h-[400px] overflow-y-auto overflow-x-hidden space-y-3" style={{ scrollbarGutter: "stable" }}>
            {approvals.slice(0, 5).map((approval) => (
              <ApprovalItem
                key={approval.id}
                approval={approval}
                onClick={() => onApprovalClick(approval)}
              />
            ))}
            {approvals.length > 5 && (
              <Link href="/signatures">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Ver todas ({approvals.length})
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
