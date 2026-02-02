"use client";

import { Shield, Lock, Upload, FileText } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import type { UseFormReturn } from "react-hook-form";
import type { VerifyHashFormData } from "@/lib/validations/document";

interface VerifyFormProps {
  form: UseFormReturn<VerifyHashFormData>;
  loading: boolean;
  calculatingHash: boolean;
  uploadedFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: VerifyHashFormData) => void;
}

function FileUploadArea({
  calculatingHash,
  uploadedFile,
  onFileUpload,
}: {
  calculatingHash: boolean;
  uploadedFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload do Documento</label>
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          onChange={onFileUpload}
          disabled={calculatingHash}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            calculatingHash
              ? "border-primary bg-primary/5 cursor-not-allowed"
              : "border-border/50 hover:border-primary hover:bg-primary/5"
          }`}
        >
          {calculatingHash ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <p className="text-sm text-muted-foreground">Calculando hash...</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-primary">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">Clique para trocar</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-border/50"></div>
      <span className="flex-shrink mx-4 text-xs text-muted-foreground">OU</span>
      <div className="flex-grow border-t border-border/50"></div>
    </div>
  );
}

export function VerifyForm({
  form,
  loading,
  calculatingHash,
  uploadedFile,
  onFileUpload,
  onSubmit,
}: VerifyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Card className="border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Verificar Documento
        </CardTitle>
        <CardDescription>
          Faça upload do documento ou cole o hash SHA-256 para verificar sua autenticidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FileUploadArea
            calculatingHash={calculatingHash}
            uploadedFile={uploadedFile}
            onFileUpload={onFileUpload}
          />

          <Divider />

          <div className="space-y-2">
            <label className="text-sm font-medium">Hash SHA-256</label>
            <Input
              placeholder="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
              className="text-sm h-12 bg-background/50 border-border/50"
              {...register("hash")}
            />
            {errors.hash && (
              <p className="text-xs text-destructive">{errors.hash.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 cursor-pointer"
            disabled={loading || calculatingHash}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verificando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verificar Hash
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
