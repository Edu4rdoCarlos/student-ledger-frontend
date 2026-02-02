"use client";

import { useState } from "react";
import { useApprovals, type PendingApproval } from "@/hooks/use-approvals";
import { approvalService } from "@/lib/services/approval-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";

interface RejectionInfo {
  approvalId: string;
  documentTitle: string;
  rejectionReason: string;
  approverName: string;
}

export function useSignaturesPage() {
  const { user } = useAuthStore();

  const {
    approvals: pendingApprovals,
    loading: pendingLoading,
    refetch: refetchPending,
  } = useApprovals("PENDING");

  const {
    approvals: approvedApprovals,
    loading: approvedLoading,
    refetch: refetchApproved,
  } = useApprovals("APPROVED");

  const {
    approvals: rejectedApprovals,
    loading: rejectedLoading,
    refetch: refetchRejected,
  } = useApprovals("REJECTED");

  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [reconsiderModalOpen, setReconsiderModalOpen] = useState(false);
  const [selectedRejection, setSelectedRejection] = useState<RejectionInfo | null>(null);
  const [reconsiderationReason, setReconsiderationReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [selectedForNewVersion, setSelectedForNewVersion] = useState<RejectionInfo | null>(null);

  const [evaluateModalOpen, setEvaluateModalOpen] = useState(false);
  const [selectedForEvaluation, setSelectedForEvaluation] = useState<PendingApproval | null>(null);

  const handleApprovalClick = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setModalOpen(true);
  };

  const handleRequestReconsideration = (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => {
    setSelectedRejection({
      approvalId,
      documentTitle,
      rejectionReason,
      approverName,
    });
    setReconsiderModalOpen(true);
  };

  const handleNewVersion = (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => {
    setSelectedForNewVersion({
      approvalId,
      documentTitle,
      rejectionReason,
      approverName,
    });
    setNewVersionModalOpen(true);
  };

  const handleEvaluate = (approval: PendingApproval) => {
    setSelectedForEvaluation(approval);
    setEvaluateModalOpen(true);
  };

  const handleSubmitReconsideration = async () => {
    if (!selectedRejection) return;

    if (!reconsiderationReason.trim()) {
      toast.error("Por favor, informe o motivo da solicitação de reconsideração");
      return;
    }

    setSubmitting(true);
    try {
      await approvalService.overrideRejection(
        selectedRejection.approvalId,
        reconsiderationReason
      );
      toast.success("Solicitação de reconsideração enviada!", {
        description: "O avaliador será notificado e a assinatura voltará para pendente.",
      });
      setReconsiderModalOpen(false);
      setReconsiderationReason("");
      setSelectedRejection(null);
      refetchRejected();
      refetchPending();
    } catch (error) {
      console.error("Erro ao solicitar reconsideração:", error);
      toast.error("Erro ao solicitar reconsideração", {
        description: "Não foi possível processar sua solicitação. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseReconsiderModal = () => {
    setReconsiderModalOpen(false);
    setReconsiderationReason("");
    setSelectedRejection(null);
  };

  const handleNewVersionSuccess = () => {
    setSelectedForNewVersion(null);
    refetchRejected();
    refetchPending();
  };

  const handleEvaluationSuccess = () => {
    setSelectedForEvaluation(null);
    refetchPending();
    refetchApproved();
  };

  const filterApprovals = (approvals: PendingApproval[]) => {
    if (!searchQuery) return approvals;

    const query = searchQuery.toLowerCase();
    return approvals.filter(
      (approval) =>
        approval.documentTitle.toLowerCase().includes(query) ||
        approval.courseName.toLowerCase().includes(query) ||
        approval.students.some((s) => s.name.toLowerCase().includes(query))
    );
  };

  return {
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
  };
}
