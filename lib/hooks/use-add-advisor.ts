"use client";

import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  addAdvisorSchema,
  type AddAdvisorFormData,
} from "@/lib/validations/advisor";
import { advisorService } from "@/lib/services/advisor-service";

interface UseAddAdvisorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface UseAddAdvisorReturn {
  form: UseFormReturn<AddAdvisorFormData>;
  onSubmit: () => void;
  handleClose: () => void;
}

export function useAddAdvisor({
  open,
  onOpenChange,
  onSuccess,
}: UseAddAdvisorProps): UseAddAdvisorReturn {
  const form = useForm<AddAdvisorFormData>({
    resolver: zodResolver(addAdvisorSchema),
    defaultValues: {
      email: "",
      name: "",
      specialization: "",
      courseId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const submitHandler = async (data: AddAdvisorFormData) => {
    try {
      await advisorService.createAdvisor({
        email: data.email,
        name: data.name,
        specialization: data.specialization,
        courseId: data.courseId,
      });

      toast.success("Orientador cadastrado com sucesso!");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao cadastrar orientador:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao cadastrar orientador", {
        description: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!form.formState.isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(submitHandler),
    handleClose,
  };
}
