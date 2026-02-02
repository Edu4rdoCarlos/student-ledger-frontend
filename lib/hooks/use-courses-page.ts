"use client";

import { useState, useMemo } from "react";
import { useCourses } from "@/hooks/use-courses";
import { useUser } from "@/lib/hooks/use-user-role";
import { isAdmin, isAdvisor, isCoordinator, isStudent } from "@/lib/types";
import type { Course } from "@/lib/types/course";

export function useCoursesPage() {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const { courses, myCourses, metadata, loading, refetch } = useCourses(currentPage, 12);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const otherCourses = useMemo(() => {
    if (!user || !isCoordinator(user) || myCourses.length === 0) {
      return courses;
    }
    const myCoursesIds = new Set(myCourses.map(c => c.id));
    return courses.filter(course => !myCoursesIds.has(course.id));
  }, [courses, myCourses, user]);

  const canCreate = user ? isAdmin(user) : false;

  const canEditCourse = (course: Course) => {
    if (!user) return false;
    if (isStudent(user) || isAdvisor(user)) return false;
    if (isAdmin(user)) return true;
    if (isCoordinator(user) && course.coordinator?.email === user.email) return true;
    return false;
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormDialogOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setIsFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingCourse(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showMyCoursesSection = user && isCoordinator(user) && myCourses.length > 0;

  return {
    user,
    courses,
    myCourses,
    otherCourses,
    metadata,
    loading,
    selectedCourse,
    isDetailsModalOpen,
    isFormDialogOpen,
    editingCourse,
    canCreate,
    showMyCoursesSection,
    setIsDetailsModalOpen,
    setIsFormDialogOpen,
    canEditCourse,
    handleViewDetails,
    handleEdit,
    handleCreate,
    handleFormSuccess,
    handlePageChange,
  };
}
