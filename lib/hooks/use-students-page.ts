"use client";

import { useState } from "react";
import { useStudents } from "@/hooks/use-students";
import { studentService } from "@/lib/services/student-service";
import type { Student } from "@/lib/types";

export function useStudentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { students, metadata, loading, refetch } = useStudents(currentPage, 10);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleViewDetails = async (student: Student) => {
    try {
      setLoadingDetails(true);
      setIsModalOpen(true);

      const registration = student.registration || student.matricula;
      if (!registration) {
        console.error("Estudante sem matrícula");
        setSelectedStudent(student);
        return;
      }

      const fullStudentData = await studentService.getStudentByRegistration(registration);
      setSelectedStudent(fullStudentData);
    } catch (error) {
      console.error("Erro ao buscar detalhes do estudante:", error);
      setSelectedStudent(student);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStudent = async (
    registration: string,
    data: { name: string; courseId: string }
  ) => {
    try {
      await studentService.updateStudent(registration, data);
      const updatedStudent = await studentService.getStudentByRegistration(registration);
      setSelectedStudent(updatedStudent);
      await refetch(currentPage, 10);
    } catch (error) {
      console.error("Erro ao atualizar estudante:", error);
      throw error;
    }
  };

  const handleAddSuccess = () => refetch(currentPage, 10);

  return {
    students,
    metadata,
    loading,
    currentPage,
    selectedStudent,
    isModalOpen,
    loadingDetails,
    isAddDialogOpen,
    setIsModalOpen,
    setIsAddDialogOpen,
    handlePageChange,
    handleViewDetails,
    handleUpdateStudent,
    handleAddSuccess,
  };
}
