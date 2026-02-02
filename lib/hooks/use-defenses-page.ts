"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user-role";
import { defenseService } from "@/lib/services/defense-service";
import { advisorService } from "@/lib/services/advisor-service";
import { courseService } from "@/lib/services/course-service";
import type { Defense, Advisor, Student } from "@/lib/types";

export function useDefensesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [myDefenses, setMyDefenses] = useState<Defense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const myDefenseIds = useMemo(() => {
    return myDefenses.map(d => d.id);
  }, [myDefenses]);

  const otherDefenses = useMemo(() => {
    return defenses.filter(d => !myDefenseIds.includes(d.id));
  }, [defenses, myDefenseIds]);

  const canCreateDefense = user?.role === "COORDINATOR" || user?.role === "ADMIN";

  useEffect(() => {
    const fetchMyDefenses = async () => {
      try {
        const data = await defenseService.getMyDefenses();
        setMyDefenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching my defenses:", error);
        setMyDefenses([]);
      }
    };

    fetchMyDefenses();
  }, []);

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        setLoading(true);
        const response = await defenseService.getAllDefenses(1, 100, "desc", searchQuery);
        setDefenses(response.data);
      } catch (error) {
        console.error("Error fetching defenses:", error);
        setDefenses([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDefenses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAdvisorsAndStudents = async () => {
      try {
        const courseId = user?.courseId;

        if (!courseId) {
          return;
        }

        const [advisorsResponse, studentsResponse] = await Promise.all([
          courseService.getAdvisorsByCourse(courseId),
          courseService.getStudentsByCourse(courseId),
        ]);
        setAdvisors(advisorsResponse.data);
        setStudents(studentsResponse.data.filter(student => student.defensesCount === 0));
      } catch (error) {
        console.error("Error fetching advisors and students:", error);
      }
    };

    if (canCreateDefense && isFormDialogOpen) {
      fetchAdvisorsAndStudents();
    }
  }, [canCreateDefense, isFormDialogOpen, user?.courseId]);

  const handleViewDetails = (defense: Defense) => {
    router.push(`/defenses/${defense.id}`);
  };

  const handleFormSuccess = async () => {
    const [allDefensesResponse, myDefensesData] = await Promise.all([
      defenseService.getAllDefenses(1, 100, "desc", searchQuery),
      defenseService.getMyDefenses(),
    ]);
    setDefenses(allDefensesResponse.data);
    setMyDefenses(Array.isArray(myDefensesData) ? myDefensesData : []);
  };

  const handleOpenDialog = async () => {
    setIsFormDialogOpen(true);
    if (advisors.length === 0 || students.length === 0) {
      try {
        const courseId = user?.courseId;
        if (!courseId) {
          return;
        }

        const [advisorsResponse, studentsResponse] = await Promise.all([
          advisorService.getAllAdvisors(1, 100),
          courseService.getStudentsByCourse(courseId),
        ]);
        setAdvisors(advisorsResponse.data);
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error("Error fetching advisors and students:", error);
      }
    }
  };

  return {
    user,
    defenses,
    myDefenses,
    otherDefenses,
    loading,
    searchQuery,
    setSearchQuery,
    isFormDialogOpen,
    setIsFormDialogOpen,
    advisors,
    students,
    canCreateDefense,
    handleViewDetails,
    handleFormSuccess,
    handleOpenDialog,
  };
}
