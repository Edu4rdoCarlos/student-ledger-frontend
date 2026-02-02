"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/tabs";
import { ApprovalsList } from "./approvals-list";
import type { PendingApproval } from "@/hooks/use-approvals";

interface SignaturesTabsProps {
  pendingApprovals: PendingApproval[];
  pendingLoading: boolean;
  approvedApprovals: PendingApproval[];
  approvedLoading: boolean;
  rejectedApprovals: PendingApproval[];
  rejectedLoading: boolean;
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
  filterApprovals: (approvals: PendingApproval[]) => PendingApproval[];
}

export function SignaturesTabs({
  pendingApprovals,
  pendingLoading,
  approvedApprovals,
  approvedLoading,
  rejectedApprovals,
  rejectedLoading,
  searchQuery,
  userId,
  userRole,
  onCardClick,
  onEvaluate,
  onReconsider,
  onNewVersion,
  filterApprovals,
}: SignaturesTabsProps) {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending" className="gap-2">
          <Clock className="h-4 w-4" />
          Pendentes ({pendingApprovals.length})
        </TabsTrigger>
        <TabsTrigger value="approved" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Aprovadas ({approvedApprovals.length})
        </TabsTrigger>
        <TabsTrigger value="rejected" className="gap-2">
          <XCircle className="h-4 w-4" />
          Rejeitadas ({rejectedApprovals.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <ApprovalsList
          approvals={filterApprovals(pendingApprovals)}
          loading={pendingLoading}
          status="PENDING"
          emptyMessage="Nenhuma assinatura pendente"
          searchQuery={searchQuery}
          userId={userId}
          userRole={userRole}
          onCardClick={onCardClick}
          onEvaluate={onEvaluate}
          onReconsider={onReconsider}
          onNewVersion={onNewVersion}
        />
      </TabsContent>

      <TabsContent value="approved">
        <ApprovalsList
          approvals={filterApprovals(approvedApprovals)}
          loading={approvedLoading}
          status="APPROVED"
          emptyMessage="Nenhuma assinatura aprovada"
          searchQuery={searchQuery}
          userId={userId}
          userRole={userRole}
          onCardClick={onCardClick}
          onEvaluate={onEvaluate}
          onReconsider={onReconsider}
          onNewVersion={onNewVersion}
        />
      </TabsContent>

      <TabsContent value="rejected">
        <ApprovalsList
          approvals={filterApprovals(rejectedApprovals)}
          loading={rejectedLoading}
          status="REJECTED"
          emptyMessage="Nenhuma assinatura rejeitada"
          searchQuery={searchQuery}
          userId={userId}
          userRole={userRole}
          onCardClick={onCardClick}
          onEvaluate={onEvaluate}
          onReconsider={onReconsider}
          onNewVersion={onNewVersion}
        />
      </TabsContent>
    </Tabs>
  );
}
