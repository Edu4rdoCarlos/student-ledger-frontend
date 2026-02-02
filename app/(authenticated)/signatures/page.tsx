"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ApprovalDetailsModal } from "@/components/layout/approvals/approval-details-modal";
import { NewVersionModal } from "@/components/layout/documents/new-version-modal";
import { EvaluateDocumentModal } from "@/components/layout/documents/evaluate-document-modal";
import {
  SignaturesHeader,
  SignaturesSearch,
  SignaturesTabs,
  ReconsiderModal,
} from "@/components/layout/signatures";
import { useSignaturesPage } from "@/lib/hooks/use-signatures-page";

export default function SignaturesPage() {
  const {
    user,
    pendingApprovals,
    pendingLoading,
    approvedApprovals,
    approvedLoading,
    rejectedApprovals,
    rejectedLoading,
    selectedApproval,
    modalOpen,
    setModalOpen,
    searchQuery,
    setSearchQuery,
    reconsiderModalOpen,
    selectedRejection,
    reconsiderationReason,
    setReconsiderationReason,
    submitting,
    newVersionModalOpen,
    setNewVersionModalOpen,
    selectedForNewVersion,
    evaluateModalOpen,
    setEvaluateModalOpen,
    selectedForEvaluation,
    handleApprovalClick,
    handleRequestReconsideration,
    handleNewVersion,
    handleEvaluate,
    handleSubmitReconsideration,
    handleCloseReconsiderModal,
    handleNewVersionSuccess,
    handleEvaluationSuccess,
    filterApprovals,
  } = useSignaturesPage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SignaturesHeader />

        <SignaturesSearch value={searchQuery} onChange={setSearchQuery} />

        <SignaturesTabs
          pendingApprovals={pendingApprovals}
          pendingLoading={pendingLoading}
          approvedApprovals={approvedApprovals}
          approvedLoading={approvedLoading}
          rejectedApprovals={rejectedApprovals}
          rejectedLoading={rejectedLoading}
          searchQuery={searchQuery}
          userId={user?.id}
          userRole={user?.role}
          onCardClick={handleApprovalClick}
          onEvaluate={handleEvaluate}
          onReconsider={handleRequestReconsideration}
          onNewVersion={handleNewVersion}
          filterApprovals={filterApprovals}
        />
      </div>

      <ApprovalDetailsModal
        approval={selectedApproval}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <ReconsiderModal
        open={reconsiderModalOpen}
        onOpenChange={handleCloseReconsiderModal}
        rejection={selectedRejection}
        reason={reconsiderationReason}
        onReasonChange={setReconsiderationReason}
        submitting={submitting}
        onSubmit={handleSubmitReconsideration}
        onClose={handleCloseReconsiderModal}
      />

      {selectedForNewVersion && (
        <NewVersionModal
          open={newVersionModalOpen}
          onOpenChange={setNewVersionModalOpen}
          documentTitle={selectedForNewVersion.documentTitle}
          approvalId={selectedForNewVersion.approvalId}
          rejectionReason={selectedForNewVersion.rejectionReason}
          approverName={selectedForNewVersion.approverName}
          isReplacement
          onSuccess={handleNewVersionSuccess}
        />
      )}

      {selectedForEvaluation && (
        <EvaluateDocumentModal
          open={evaluateModalOpen}
          onOpenChange={setEvaluateModalOpen}
          documentId={selectedForEvaluation.documentId}
          documentTitle={selectedForEvaluation.documentTitle}
          students={selectedForEvaluation.students}
          courseName={selectedForEvaluation.courseName}
          approvalId={
            selectedForEvaluation.signatures.find(
              (s) => s.status === "PENDING" && s.approverId === user?.id
            )?.id || ""
          }
          onSuccess={handleEvaluationSuccess}
        />
      )}
    </DashboardLayout>
  );
}
