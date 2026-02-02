"use client";

import { useState } from "react";
import {
  FileText,
  AlertCircle,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCcw,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/shared/card";
import { useApprovals, type PendingApproval } from "@/hooks/use-approvals";
import { ApprovalDetailsModal } from "@/components/layout/approvals/approval-details-modal";
import { NewVersionModal } from "@/components/layout/documents/new-version-modal";
import { EvaluateDocumentModal } from "@/components/layout/documents/evaluate-document-modal";
import { Input } from "@/components/primitives/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/tabs";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { Textarea } from "@/components/primitives/textarea";
import { approvalService } from "@/lib/services/approval-service";
import { getRoleLabel } from "@/lib/utils/role-utils";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/auth-store";

export default function SignaturesPage() {
  const { user } = useAuthStore();
  const {
    approvals: pendingApprovals,
    loading: pendingLoading,
    refetch: refetchPending,
  } = useApprovals("PENDING");
  const {
    approvals: approvedApprovals,
    loading: approvedLoading,
    refetch: refetchApproved,
  } = useApprovals("APPROVED");
  const {
    approvals: rejectedApprovals,
    loading: rejectedLoading,
    refetch: refetchRejected,
  } = useApprovals("REJECTED");
  const [selectedApproval, setSelectedApproval] =
    useState<PendingApproval | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reconsiderModalOpen, setReconsiderModalOpen] = useState(false);
  const [selectedRejection, setSelectedRejection] = useState<{
    approvalId: string;
    documentTitle: string;
    rejectionReason: string;
    approverName: string;
  } | null>(null);
  const [reconsiderationReason, setReconsiderationReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [selectedForNewVersion, setSelectedForNewVersion] = useState<{
    approvalId: string;
    documentTitle: string;
    rejectionReason: string;
    approverName: string;
  } | null>(null);
  const [evaluateModalOpen, setEvaluateModalOpen] = useState(false);
  const [selectedForEvaluation, setSelectedForEvaluation] =
    useState<PendingApproval | null>(null);

  const handleApprovalClick = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setModalOpen(true);
  };

  const handleRequestReconsideration = (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => {
    setSelectedRejection({
      approvalId,
      documentTitle,
      rejectionReason,
      approverName,
    });
    setReconsiderModalOpen(true);
  };

  const handleNewVersion = (
    approvalId: string,
    documentTitle: string,
    rejectionReason: string,
    approverName: string
  ) => {
    setSelectedForNewVersion({
      approvalId,
      documentTitle,
      rejectionReason,
      approverName,
    });
    setNewVersionModalOpen(true);
  };

  const handleEvaluate = (approval: PendingApproval) => {
    setSelectedForEvaluation(approval);
    setEvaluateModalOpen(true);
  };

  const handleSubmitReconsideration = async () => {
    if (!selectedRejection) return;

    if (!reconsiderationReason.trim()) {
      toast.error(
        "Por favor, informe o motivo da solicitação de reconsideração"
      );
      return;
    }

    setSubmitting(true);
    try {
      await approvalService.overrideRejection(
        selectedRejection.approvalId,
        reconsiderationReason
      );
      toast.success("Solicitação de reconsideração enviada!", {
        description:
          "O avaliador será notificado e a assinatura voltará para pendente.",
      });
      setReconsiderModalOpen(false);
      setReconsiderationReason("");
      setSelectedRejection(null);
      // Refetch both lists
      refetchRejected();
      refetchPending();
    } catch (error) {
      console.error("Erro ao solicitar reconsideração:", error);
      toast.error("Erro ao solicitar reconsideração", {
        description:
          "Não foi possível processar sua solicitação. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filterApprovals = (approvals: PendingApproval[]) => {
    if (!searchQuery) return approvals;

    const query = searchQuery.toLowerCase();
    return approvals.filter(
      (approval) =>
        approval.documentTitle.toLowerCase().includes(query) ||
        approval.courseName.toLowerCase().includes(query) ||
        approval.students.some((s) => s.name.toLowerCase().includes(query))
    );
  };

  const renderApprovalCard = (
    approval: PendingApproval,
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    const signatures = approval.signatures || approval.approvals || [];
    const coordinatorSig = signatures.find((s) => s.role === "COORDINATOR");
    const advisorSig = signatures.find((s) => s.role === "ADVISOR");
    const isCoordinatorAlsoAdvisor = !!(
      coordinatorSig?.approverId &&
      advisorSig?.approverId &&
      coordinatorSig.approverId === advisorSig.approverId
    );

    const displaySignatures = isCoordinatorAlsoAdvisor
      ? signatures.filter((s) => s.role !== "ADVISOR")
      : signatures;

    const approvedCount = signatures.filter(
      (s) => s.status === "APPROVED"
    ).length;
    const totalSignatures = displaySignatures.length;
    const pendingRoles = displaySignatures
      .filter((s) => s.status === "PENDING")
      .map((s) => getRoleLabel(s.role, isCoordinatorAlsoAdvisor))
      .join(", ");

    const rejectedSignature = signatures.find((s) => s.status === "REJECTED");

    const myPendingApproval = signatures.find(
      (s) => s.status === "PENDING" && s.approverId === user?.id
    );

    const hasRejection = !!rejectedSignature;
    const isCoordinator = user?.role === "COORDINATOR";

    const otherSignatures = signatures.filter((s) => s.approverId !== user?.id);
    const allOthersApproved =
      otherSignatures.length === 0 ||
      otherSignatures.every((s) => s.status === "APPROVED");

    const canEvaluate =
      myPendingApproval &&
      !(isCoordinator && hasRejection) &&
      (!isCoordinator || allOthersApproved);

    const statusColors = {
      PENDING: {
        bg: "from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900/50 dark:to-orange-950/20",
        border: "border-amber-400 dark:border-amber-600",
        text: "text-amber-700 dark:text-amber-400",
        icon: Clock,
      },
      APPROVED: {
        bg: "from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-slate-900/50 dark:to-teal-950/20",
        border: "border-emerald-400 dark:border-emerald-600",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: CheckCircle,
      },
      REJECTED: {
        bg: "from-red-50/50 via-white to-rose-50/30 dark:from-red-950/20 dark:via-slate-900/50 dark:to-rose-950/20",
        border: "border-red-400 dark:border-red-600",
        text: "text-red-700 dark:text-red-400",
        icon: XCircle,
      },
    };

    const config = statusColors[status];
    const StatusIcon = config.icon;

    return (
      <div
        key={approval.id}
        className={`group rounded-xl border border-border/50 bg-gradient-to-br ${config.bg} p-4 transition-all hover:shadow-lg hover:${config.border} hover:scale-[1.02] cursor-pointer`}
      >
        <div className="space-y-3 flex flex-col justify-between h-full">
          <div
            className="flex flex-col-reverse  items-start justify-between gap-3"
            onClick={() => handleApprovalClick(approval)}
          >
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-start gap-2">
                <FileText
                  className={`h-4 w-4 ${config.text} mt-0.5 flex-shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold text-foreground group-hover:${config.text} transition-colors line-clamp-2`}
                  >
                    {approval.documentTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {approval.courseName}
                  </p>
                </div>
              </div>

              {approval.students.length > 0 && (
                <div className="flex items-start gap-1.5 pl-6 w-full">
                  <User className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground flex-1">
                    {approval.students.map((s) => s.name).join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col m-0 ml-auto items-end gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md bg-${
                  status === "PENDING"
                    ? "amber"
                    : status === "APPROVED"
                    ? "emerald"
                    : "red"
                }-100 dark:bg-${
                  status === "PENDING"
                    ? "amber"
                    : status === "APPROVED"
                    ? "emerald"
                    : "red"
                }-900/30`}
              >
                <StatusIcon className={`h-3 w-3 ${config.text}`} />
                <span className={`text-xs font-medium ${config.text}`}>
                  {status === "PENDING"
                    ? pendingRoles
                    : status === "APPROVED"
                    ? "Aprovado"
                    : "Rejeitado"}
                </span>
              </div>
            </div>
          </div>

          {status === "PENDING" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pl-6">
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${(approvedCount / totalSignatures) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {approvedCount}/{totalSignatures}
                </span>
              </div>
              <div className="pt-2 border-t space-y-2">
                {isCoordinator && hasRejection && (
                  <p className="text-xs text-center text-muted-foreground italic">
                    Aguardando resolução da rejeição antes de avaliar
                  </p>
                )}
                {isCoordinator && !hasRejection && !allOthersApproved && (
                  <p className="text-xs text-center text-muted-foreground italic">
                    Aguardando as demais aprovações antes de avaliar
                  </p>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEvaluate(approval);
                  }}
                  disabled={!canEvaluate || !myPendingApproval}
                  className="w-full gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Avaliar Documento
                </Button>
              </div>
            </div>
          )}

          {status === "REJECTED" && rejectedSignature && (
            <div className="pl-6 space-y-3 border-t pt-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Rejeitado por:
                </p>
                <p className="text-sm font-medium">
                  {rejectedSignature.approverName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rejectedSignature.role}
                </p>
              </div>
              {rejectedSignature.justification && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Motivo da rejeição:
                  </p>
                  <p className="text-sm text-muted-foreground italic border-l-2 border-red-400 pl-2">
                    &ldquo;{rejectedSignature.justification}&rdquo;
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestReconsideration(
                      rejectedSignature.id,
                      approval.documentTitle,
                      rejectedSignature.justification || "Sem justificativa",
                      rejectedSignature.approverName
                    );
                  }}
                  className="flex-1 gap-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:border-slate-500"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reconsiderar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewVersion(
                      rejectedSignature.id,
                      approval.documentTitle,
                      rejectedSignature.justification || "Sem justificativa",
                      rejectedSignature.approverName
                    );
                  }}
                  className="flex-1 gap-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:border-slate-500"
                >
                  <Upload className="h-4 w-4" />
                  Substituir Documento
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApprovalsList = (
    approvals: PendingApproval[],
    loading: boolean,
    status: "PENDING" | "APPROVED" | "REJECTED",
    emptyMessage: string
  ) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Carregando aprovações...
            </p>
          </div>
        </div>
      );
    }

    const filteredApprovals = filterApprovals(approvals);

    if (filteredApprovals.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "Nenhuma assinatura encontrada" : emptyMessage}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery
                ? "Tente ajustar os filtros de busca"
                : "Não há aprovações nesta categoria no momento."}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {filteredApprovals.map((approval) =>
          renderApprovalCard(approval, status)
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Aprovações
            </h1>
            <p className="text-muted-foreground">
              Gerencie as aprovações de documentos do sistema
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar aprovações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800"
          />
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Aprovadas ({approvedApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejeitadas ({rejectedApprovals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {renderApprovalsList(
              pendingApprovals,
              pendingLoading,
              "PENDING",
              "Nenhuma assinatura pendente"
            )}
          </TabsContent>

          <TabsContent value="approved">
            {renderApprovalsList(
              approvedApprovals,
              approvedLoading,
              "APPROVED",
              "Nenhuma assinatura aprovada"
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {renderApprovalsList(
              rejectedApprovals,
              rejectedLoading,
              "REJECTED",
              "Nenhuma assinatura rejeitada"
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ApprovalDetailsModal
        approval={selectedApproval}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <Dialog open={reconsiderModalOpen} onOpenChange={setReconsiderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Reconsideração</DialogTitle>
            <DialogDescription>
              Você está solicitando que o avaliador reconsidere a rejeição deste
              documento.
            </DialogDescription>
          </DialogHeader>

          {selectedRejection && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Documento</label>
                <p className="text-sm text-muted-foreground">
                  {selectedRejection.documentTitle}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rejeitado por</label>
                <p className="text-sm font-medium">
                  {selectedRejection.approverName}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Motivo da rejeição
                </label>
                <p className="text-sm text-muted-foreground italic border-l-2 border-red-400 pl-3 py-2 bg-red-50 dark:bg-red-950/20 rounded">
                  &ldquo;{selectedRejection.rejectionReason}&rdquo;
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Justificativa para reconsideração{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Explique por que você acredita que o documento deveria ser reconsiderado..."
                  value={reconsiderationReason}
                  onChange={(e) => setReconsiderationReason(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Esta justificativa será enviada ao avaliador junto com a
                  notificação de reconsideração.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setReconsiderModalOpen(false);
                setReconsiderationReason("");
                setSelectedRejection(null);
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitReconsideration}
              disabled={submitting || !reconsiderationReason.trim()}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              {submitting ? "Enviando..." : "Solicitar Reconsideração"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedForNewVersion && (
        <NewVersionModal
          open={newVersionModalOpen}
          onOpenChange={setNewVersionModalOpen}
          documentTitle={selectedForNewVersion.documentTitle}
          approvalId={selectedForNewVersion.approvalId}
          rejectionReason={selectedForNewVersion.rejectionReason}
          approverName={selectedForNewVersion.approverName}
          isReplacement
          onSuccess={() => {
            setSelectedForNewVersion(null);
            refetchRejected();
            refetchPending();
          }}
        />
      )}

      {selectedForEvaluation && (
        <EvaluateDocumentModal
          open={evaluateModalOpen}
          onOpenChange={setEvaluateModalOpen}
          documentId={selectedForEvaluation.documentId}
          documentTitle={selectedForEvaluation.documentTitle}
          students={selectedForEvaluation.students}
          courseName={selectedForEvaluation.courseName}
          approvalId={
            selectedForEvaluation.signatures.find(
              (s) => s.status === "PENDING" && s.approverId === user?.id
            )?.id || ""
          }
          onSuccess={() => {
            setSelectedForEvaluation(null);
            refetchPending();
            refetchApproved();
          }}
        />
      )}
    </DashboardLayout>
  );
}
