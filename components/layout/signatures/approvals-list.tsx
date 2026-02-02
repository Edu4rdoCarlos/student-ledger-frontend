"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/shared/card";
import { ApprovalCard } from "./approval-card";
import type { PendingApproval } from "@/hooks/use-approvals";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ApprovalsListProps {
  approvals: PendingApproval[];
  loading: boolean;
  status: ApprovalStatus;
  emptyMessage: string;
  searchQuery: string;
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

function ApprovalsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando aprovações...</p>
      </div>
    </div>
  );
}

function ApprovalsEmptyState({
  searchQuery,
  emptyMessage,
}: {
  searchQuery: string;
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery ? "Nenhuma assinatura encontrada" : emptyMessage}
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          {searchQuery
            ? "Tente ajustar os filtros de busca"
            : "Não há aprovações nesta categoria no momento."}
        </p>
      </CardContent>
    </Card>
  );
}

export function ApprovalsList({
  approvals,
  loading,
  status,
  emptyMessage,
  searchQuery,
  userId,
  userRole,
  onCardClick,
  onEvaluate,
  onReconsider,
  onNewVersion,
}: ApprovalsListProps) {
  if (loading) {
    return <ApprovalsLoading />;
  }

  if (approvals.length === 0) {
    return (
      <ApprovalsEmptyState searchQuery={searchQuery} emptyMessage={emptyMessage} />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {approvals.map((approval) => (
        <ApprovalCard
          key={approval.id}
          approval={approval}
          status={status}
          userId={userId}
          userRole={userRole}
          onCardClick={onCardClick}
          onEvaluate={onEvaluate}
          onReconsider={onReconsider}
          onNewVersion={onNewVersion}
        />
      ))}
    </div>
  );
}
