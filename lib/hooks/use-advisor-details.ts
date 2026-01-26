"use client";

import { useState, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  editAdvisorSchema,
  type EditAdvisorFormData,
} from "@/lib/validations/advisor";
import type { Advisor } from "@/lib/types";

interface UseAdvisorDetailsProps {
  advisor: Advisor | null;
  onUpdateAdvisor?: (
    id: string,
    data: {
      name: string;
      specialization: string;
      courseId: string;
      isActive: boolean;
    }
  ) => Promise<void>;
}

interface UseAdvisorDetailsReturn {
  isEditing: boolean;
  form: UseFormReturn<EditAdvisorFormData>;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSubmit: () => void;
}

export function useAdvisorDetails({
  advisor,
  onUpdateAdvisor,
}: UseAdvisorDetailsProps): UseAdvisorDetailsReturn {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<EditAdvisorFormData>({
    resolver: zodResolver(editAdvisorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      courseId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (advisor) {
      form.reset({
        name: advisor.name,
        specialization: advisor.specialization,
        courseId: advisor.course.id,
        isActive: advisor.isActive ?? true,
      });
    }
  }, [advisor, form]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (advisor) {
      form.reset({
        name: advisor.name,
        specialization: advisor.specialization,
        courseId: advisor.course.id,
        isActive: advisor.isActive ?? true,
      });
    }
    setIsEditing(false);
  };

  const onSubmit = async (data: EditAdvisorFormData) => {
    if (!onUpdateAdvisor || !advisor?.userId) return;

    try {
      await onUpdateAdvisor(advisor.userId, {
        name: data.name,
        specialization: data.specialization,
        courseId: data.courseId,
        isActive: data.isActive,
      });
      setIsEditing(false);
      toast.success("Orientador atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar orientador:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao atualizar orientador", {
        description: errorMessage,
      });
    }
  };

  return {
    isEditing,
    form,
    handleEdit,
    handleCancel,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
