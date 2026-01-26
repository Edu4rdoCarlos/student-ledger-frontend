"use client";

import { useState } from "react";
import { useCoordinators } from "@/hooks/use-coordinators";

export function useCoordinatorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { coordinators, metadata, loading, refetch } = useCoordinators(currentPage, 10);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleAddSuccess = () => refetch(currentPage, 10);

  return {
    coordinators,
    metadata,
    loading,
    currentPage,
    isAddDialogOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleAddSuccess,
  };
}
