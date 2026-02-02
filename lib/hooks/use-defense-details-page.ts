"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user-role";
import { defenseService } from "@/lib/services/defense-service";
import { toast } from "sonner";
import type { Defense } from "@/lib/types/defense";

export function useDefenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [defense, setDefense] = useState<Defense | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [selectedDocForNewVersion, setSelectedDocForNewVersion] = useState<{
    approvalId: string;
    documentTitle: string;
    isReplacement: boolean;
  } | null>(null);

  const userRelationship = useMemo(() => {
    if (!user || !defense) {
      return {
        isAdmin: false,
        isCoordinator: false,
        isStudent: false,
        isAdvisor: false,
        isExamBoardMember: false,
        isCoordinatorOfCourse: false,
      };
    }

    const isStudent =
      defense.students?.some((student) => student.email === user.email) ?? false;
    const isAdvisor = defense.advisor?.email === user.email;
    const isExamBoardMember =
      defense.examBoard?.some((member) => member.email === user.email) ?? false;
    const defenseCourseId = defense.course?.id;
    const isCoordinatorOfCourse =
      user.role === "COORDINATOR" && user.courseId === defenseCourseId;

    return {
      isAdmin: user.role === "ADMIN",
      isCoordinator: user.role === "COORDINATOR",
      isStudent,
      isAdvisor,
      isExamBoardMember,
      isCoordinatorOfCourse,
    };
  }, [user, defense]);

  const canDownload = useMemo(() => {
    const { isAdmin, isCoordinator, isStudent, isAdvisor, isExamBoardMember } =
      userRelationship;
    return isAdmin || isCoordinator || isStudent || isAdvisor || isExamBoardMember;
  }, [userRelationship]);

  const canViewDocuments = useMemo(() => {
    const { isAdmin, isCoordinator, isStudent, isAdvisor, isExamBoardMember } =
      userRelationship;
    return isAdmin || isCoordinator || isStudent || isAdvisor || isExamBoardMember;
  }, [userRelationship]);

  const canManageDefense = useMemo(() => {
    const { isAdmin, isCoordinatorOfCourse } = userRelationship;
    return isAdmin || isCoordinatorOfCourse;
  }, [userRelationship]);

  const canFinalizeDefense = useMemo(() => {
    if (!defense) return false;
    const defenseDate = new Date(defense.defenseDate);
    const now = new Date();
    return defenseDate <= now;
  }, [defense]);

  useEffect(() => {
    const fetchDefense = async () => {
      try {
        setLoading(true);
        const data = await defenseService.getDefenseById(params.id as string);
        setDefense(data);
      } catch (error) {
        console.error("Erro ao buscar defesa:", error);
        toast.error("Erro ao carregar defesa");
        router.push("/defenses");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDefense();
    }
  }, [params.id, router]);

  const handleRescheduleSuccess = async () => {
    try {
      const data = await defenseService.getDefenseById(params.id as string);
      setDefense(data);
    } catch (error) {
      console.error("Erro ao atualizar defesa:", error);
    }
  };

  const handleDefenseUpdate = async () => {
    if (!defense) return;
    const updatedDefense = await defenseService.getDefenseById(defense.id);
    setDefense(updatedDefense);
  };

  const goBack = () => {
    router.push("/defenses");
  };

  const openNewVersionModal = (approvalId: string, documentTitle: string, isReplacement: boolean) => {
    setSelectedDocForNewVersion({ approvalId, documentTitle, isReplacement });
    setNewVersionModalOpen(true);
  };

  return {
    user,
    defense,
    loading,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    finalizeModalOpen,
    setFinalizeModalOpen,
    cancelModalOpen,
    setCancelModalOpen,
    newVersionModalOpen,
    setNewVersionModalOpen,
    selectedDocForNewVersion,
    userRelationship,
    canDownload,
    canViewDocuments,
    canManageDefense,
    canFinalizeDefense,
    handleRescheduleSuccess,
    handleDefenseUpdate,
    goBack,
    openNewVersionModal,
  };
}
