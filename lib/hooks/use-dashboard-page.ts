"use client";

import { useState, useEffect } from "react";
import { useApprovals, type PendingApproval } from "@/hooks/use-approvals";
import { defenseService } from "@/lib/services/defense-service";
import { summaryService } from "@/lib/services/summary-service";
import type { Defense, DashboardSummary } from "@/lib/types";

export function useDashboardPage() {
  const { approvals, loading: approvalsLoading } = useApprovals();
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [recentDefenses, setRecentDefenses] = useState<Defense[]>([]);
  const [defensesLoading, setDefensesLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDefenses = async () => {
      try {
        setDefensesLoading(true);
        const response = await defenseService.getAllDefenses(1, 3, "desc");
        setRecentDefenses(response.data);
      } catch (error) {
        console.error("Error fetching recent defenses:", error);
      } finally {
        setDefensesLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const data = await summaryService.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchRecentDefenses();
    fetchSummary();
  }, []);

  const handleApprovalClick = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setModalOpen(true);
  };

  return {
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
  };
}
