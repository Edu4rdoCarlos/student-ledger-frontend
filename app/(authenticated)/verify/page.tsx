"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  VerifyHeader,
  VerifyFeatures,
  VerifyForm,
  VerifyResult,
} from "@/components/layout/verify";
import { useVerifyPage } from "@/lib/hooks/use-verify-page";

export default function VerifyPage() {
  const {
    loading,
    result,
    uploadedFile,
    calculatingHash,
    form,
    handleFileUpload,
    onSubmit,
    resetVerification,
  } = useVerifyPage();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <VerifyHeader />

        <VerifyFeatures />

        {!result ? (
          <VerifyForm
            form={form}
            loading={loading}
            calculatingHash={calculatingHash}
            uploadedFile={uploadedFile}
            onFileUpload={handleFileUpload}
            onSubmit={onSubmit}
          />
        ) : (
          <VerifyResult result={result} onReset={resetVerification} />
        )}
      </div>
    </DashboardLayout>
  );
}
