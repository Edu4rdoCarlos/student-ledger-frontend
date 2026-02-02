"use client";

import { Separator } from "@/components/primitives/separator";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { NewVersionModal } from "@/components/layout/documents/new-version-modal";
import { useDefenseDetailsPage } from "@/lib/hooks/use-defense-details-page";
import {
  DefenseDetailsHeader,
  DefenseActionsMenu,
  DefenseInfoSection,
  DefenseParticipantsSection,
  DefenseDocumentsSection,
  RescheduleDefenseModal,
  FinalizeDefenseDialog,
  CancelDefenseDialog,
} from "@/components/layout/defenses";

export default function DefenseDetailsPage() {
  const {
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
    canDownload,
    canViewDocuments,
    canManageDefense,
    handleRescheduleSuccess,
    handleDefenseUpdate,
    goBack,
    openNewVersionModal,
  } = useDefenseDetailsPage();

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState message="Carregando defesa..." />
      </DashboardLayout>
    );
  }

  if (!defense) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg">
        <DefenseDetailsHeader defense={defense} onBack={goBack} />

        {canManageDefense && defense.status !== "CANCELED" && (
          <DefenseActionsMenu
            defense={defense}
            onFinalize={() => setFinalizeModalOpen(true)}
            onReschedule={() => setIsRescheduleModalOpen(true)}
            onCancel={() => setCancelModalOpen(true)}
            onNewVersion={openNewVersionModal}
          />
        )}

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <DefenseInfoSection defense={defense} />
          <DefenseParticipantsSection defense={defense} />
        </div>

        {canViewDocuments && (
          <DefenseDocumentsSection
            defense={defense}
            canDownload={canDownload}
            currentUserEmail={user?.email}
          />
        )}
      </div>

      <RescheduleDefenseModal
        open={isRescheduleModalOpen}
        onOpenChange={setIsRescheduleModalOpen}
        onSuccess={handleRescheduleSuccess}
        defense={defense}
      />

      <FinalizeDefenseDialog
        open={finalizeModalOpen}
        onOpenChange={setFinalizeModalOpen}
        defenseId={defense.id}
        onSuccess={handleDefenseUpdate}
      />

      <CancelDefenseDialog
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        defenseId={defense.id}
        onSuccess={handleDefenseUpdate}
      />

      {selectedDocForNewVersion && (
        <NewVersionModal
          open={newVersionModalOpen}
          onOpenChange={setNewVersionModalOpen}
          documentTitle={selectedDocForNewVersion.documentTitle}
          approvalId={selectedDocForNewVersion.approvalId}
          isReplacement={selectedDocForNewVersion.isReplacement}
          onSuccess={handleDefenseUpdate}
        />
      )}
    </DashboardLayout>
  );
}
