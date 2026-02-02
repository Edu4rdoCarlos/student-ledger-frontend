"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyHashSchema, type VerifyHashFormData } from "@/lib/validations/document";
import { documentService } from "@/lib/services/document-service";
import type { DocumentValidationResponse } from "@/lib/types";
import { toast } from "sonner";

export function useVerifyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentValidationResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [calculatingHash, setCalculatingHash] = useState(false);

  const form = useForm<VerifyHashFormData>({
    resolver: zodResolver(verifyHashSchema),
    mode: "onChange",
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setCalculatingHash(true);
      setUploadedFile(file);
      toast.info("Validando documento...");

      const response = await documentService.validateDocument(file);

      if (!response) {
        toast.error("Erro ao validar documento");
        return;
      }

      setResult(response);

      if (response.document?.minutesCid) {
        form.setValue("hash", response.document.minutesCid);
      }

      switch (response.status) {
        case "APPROVED":
          toast.success("Documento autêntico!");
          break;
        case "PENDING":
          toast.warning("Documento pendente de assinatura");
          break;
        case "INACTIVE":
          toast.warning("Documento inativado");
          break;
        case "NOT_FOUND":
          toast.error("Documento não encontrado no sistema");
          break;
      }
    } catch (error) {
      toast.error("Erro ao validar documento");
      console.error(error);
    } finally {
      setCalculatingHash(false);
    }
  };

  const onSubmit = async (data: VerifyHashFormData) => {
    try {
      setLoading(true);
      const response = await documentService.verifyDocumentHash(data.hash);

      if (!response) {
        toast.error("Erro ao verificar documento");
        return;
      }

      setResult(response);

      switch (response.status) {
        case "APPROVED":
          toast.success("Documento autêntico!");
          break;
        case "PENDING":
          toast.warning("Documento pendente de assinatura");
          break;
        case "INACTIVE":
          toast.warning("Documento inativado");
          break;
        case "NOT_FOUND":
          toast.error("Documento não encontrado no sistema");
          break;
      }
    } catch (error) {
      toast.error("Erro ao verificar documento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = () => {
    setResult(null);
    setUploadedFile(null);
    form.setValue("hash", "");
  };

  return {
    loading,
    result,
    uploadedFile,
    calculatingHash,
    form,
    handleFileUpload,
    onSubmit,
    resetVerification,
  };
}
