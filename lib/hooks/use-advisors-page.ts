"use client";

import { useState } from "react";
import { useAdvisors } from "@/hooks/use-advisors";
import { advisorService } from "@/lib/services/advisor-service";
import type { Advisor } from "@/lib/types";

export function useAdvisorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { advisors, metadata, loading, refetch } = useAdvisors(currentPage, 10);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleViewDetails = async (advisor: Advisor) => {
    try {
      setLoadingDetails(true);
      setIsModalOpen(true);

      const fullAdvisorData = await advisorService.getAdvisorById(
        advisor.userId
      );
      setSelectedAdvisor(fullAdvisorData);
    } catch (error) {
      console.error("Erro ao buscar detalhes do orientador:", error);
      setSelectedAdvisor(advisor);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateAdvisor = async (
    id: string,
    data: {
      name: string;
      specialization: string;
      courseId: string;
      isActive: boolean;
    }
  ) => {
    try {
      await advisorService.updateAdvisor(id, data);
      const updatedAdvisor = await advisorService.getAdvisorById(id);
      setSelectedAdvisor(updatedAdvisor);
      await refetch(currentPage, 10);
    } catch (error) {
      console.error("Erro ao atualizar orientador:", error);
      throw error;
    }
  };

  const handleAddSuccess = () => refetch(currentPage, 10);

  return {
    advisors,
    metadata,
    loading,
    currentPage,
    selectedAdvisor,
    isModalOpen,
    loadingDetails,
    isAddDialogOpen,
    setIsModalOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleUpdateAdvisor,
    handleAddSuccess,
  };
}
