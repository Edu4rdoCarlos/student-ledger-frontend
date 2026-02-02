"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ApprovalDetailsModal } from "@/components/layout/approvals/approval-details-modal";
import { useDashboardPage } from "@/lib/hooks/use-dashboard-page";
import {
  DashboardHeader,
  DashboardStats,
  RecentDefensesCard,
  PendingApprovalsCard,
} from "@/components/layout/dashboard";

export default function DashboardPage() {
  const {
    approvals,
    approvalsLoading,
    selectedApproval,
    modalOpen,
    setModalOpen,
    recentDefenses,
    defensesLoading,
    summary,
    summaryLoading,
    handleApprovalClick,
  } = useDashboardPage();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <DashboardHeader />

        <DashboardStats summary={summary} loading={summaryLoading} />

        <div className="grid gap-6 lg:grid-cols-3">
          <RecentDefensesCard defenses={recentDefenses} loading={defensesLoading} />
          <PendingApprovalsCard
            approvals={approvals}
            loading={approvalsLoading}
            onApprovalClick={handleApprovalClick}
          />
        </div>
      </div>

      <ApprovalDetailsModal
        approval={selectedApproval}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </DashboardLayout>
  );
}
