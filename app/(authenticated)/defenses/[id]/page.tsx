"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import {
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  Download,
  Hash,
  ChevronRight,
  Upload,
  X,
  CalendarClock,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Defense } from "@/lib/types/defense";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { defenseService } from "@/lib/services/defense-service";
import { documentService } from "@/lib/services/document-service";
import { toast } from "sonner";
import { useUser } from "@/lib/hooks/use-user-role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu";
import { RescheduleDefenseModal } from "@/components/layout/defenses/reschedule-defense-modal";
import { FinalizeDefenseDialog } from "@/components/layout/defenses/finalize-defense-dialog";
import { CancelDefenseDialog } from "@/components/layout/defenses/cancel-defense-dialog";
import { NewVersionModal } from "@/components/layout/documents/new-version-modal";

export default function DefenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [defense, setDefense] = useState<Defense | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [selectedDocForNewVersion, setSelectedDocForNewVersion] = useState<{
    approvalId: string;
    documentTitle: string;
  } | null>(null);

  const userRelationship = useMemo(() => {
    if (!user || !defense) {
      return {
        isAdmin: false,
        isCoordinator: false,
        isStudent: false,
        isAdvisor: false,
        isExamBoardMember: false,
        isCoordinatorOfCourse: false,
      };
    }

    const isStudent =
      defense.students?.some((student) => student.email === user.email) ??
      false;
    const isAdvisor = defense.advisor?.email === user.email;
    const isExamBoardMember =
      defense.examBoard?.some((member) => member.email === user.email) ?? false;
    const defenseCourseId = defense.course?.id;
    const isCoordinatorOfCourse =
      user.role === "COORDINATOR" && user.courseId === defenseCourseId;

    return {
      isAdmin: user.role === "ADMIN",
      isCoordinator: user.role === "COORDINATOR",
      isStudent,
      isAdvisor,
      isExamBoardMember,
      isCoordinatorOfCourse,
    };
  }, [user, defense]);

  const canDownload = useMemo(() => {
    const { isAdmin, isCoordinator, isStudent, isAdvisor, isExamBoardMember } =
      userRelationship;
    return (
      isAdmin || isCoordinator || isStudent || isAdvisor || isExamBoardMember
    );
  }, [userRelationship]);

  const canViewDocuments = useMemo(() => {
    const { isAdmin, isCoordinator, isStudent, isAdvisor, isExamBoardMember } =
      userRelationship;
    return (
      isAdmin || isCoordinator || isStudent || isAdvisor || isExamBoardMember
    );
  }, [userRelationship]);

  const canManageDefense = useMemo(() => {
    const { isAdmin, isCoordinatorOfCourse } = userRelationship;
    return isAdmin || isCoordinatorOfCourse;
  }, [userRelationship]);

  const canFinalizeDefense = useMemo(() => {
    if (!defense) return false;
    const defenseDate = new Date(defense.defenseDate);
    const now = new Date();
    return defenseDate <= now;
  }, [defense]);

  useEffect(() => {
    const fetchDefense = async () => {
      try {
        setLoading(true);
        const data = await defenseService.getDefenseById(params.id as string);
        setDefense(data);
      } catch (error) {
        console.error("Erro ao buscar defesa:", error);
        toast.error("Erro ao carregar defesa");
        router.push("/defenses");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDefense();
    }
  }, [params.id, router]);

  const handleRescheduleSuccess = async () => {
    try {
      const data = await defenseService.getDefenseById(params.id as string);
      setDefense(data);
    } catch (error) {
      console.error("Erro ao atualizar defesa:", error);
    }
  };

  const getRoleLabel = (roles: string[]) => {
    const hasCoordinator = roles.includes("COORDINATOR");
    const hasAdvisor = roles.includes("ADVISOR");
    const hasStudent = roles.includes("STUDENT");

    if (hasCoordinator && hasAdvisor) {
      return "Coordenador e Orientador";
    }
    if (hasCoordinator) {
      return "Coordenador";
    }
    if (hasAdvisor) {
      return "Orientador";
    }
    if (hasStudent) {
      return "Aluno";
    }
    return roles.join(", ");
  };

  const mergeSignaturesByEmail = (
    signatures:
      | Array<{
          role: string;
          email: string;
          timestamp: string;
          status: "PENDING" | "APPROVED" | "REJECTED";
          justification?: string;
        }>
      | undefined
  ) => {
    if (!signatures) return [];

    const signatureMap = new Map<
      string,
      {
        roles: string[];
        email: string;
        timestamp: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        justification?: string;
      }
    >();

    for (const sig of signatures) {
      const existing = signatureMap.get(sig.email);
      if (existing) {
        existing.roles.push(sig.role);
        if (sig.status === "REJECTED") {
          existing.status = "REJECTED";
          existing.justification = sig.justification;
        } else if (sig.status === "PENDING" && existing.status !== "REJECTED") {
          existing.status = "PENDING";
        }
        if (
          sig.timestamp &&
          (!existing.timestamp ||
            new Date(sig.timestamp) > new Date(existing.timestamp))
        ) {
          existing.timestamp = sig.timestamp;
        }
      } else {
        signatureMap.set(sig.email, {
          roles: [sig.role],
          email: sig.email,
          timestamp: sig.timestamp,
          status: sig.status,
          justification: sig.justification,
        });
      }
    }

    return Array.from(signatureMap.values());
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando defesa...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!defense) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/defenses")}
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/defenses"
              className="hover:text-foreground transition-colors"
            >
              Defesas
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Detalhes</span>
          </nav>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{defense.title}</h1>
          <div className="flex flex-wrap gap-2">
            {defense.status === "SCHEDULED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                <Clock className="h-3 w-3" />
                Agendada
              </span>
            )}
            {defense.status === "COMPLETED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Concluída
              </span>
            )}
            {defense.status === "CANCELED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Cancelada
              </span>
            )}
            {defense.result === "APPROVED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Aprovado
              </span>
            )}
            {defense.result === "FAILED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                Reprovado
              </span>
            )}
          </div>
        </div>

        {canManageDefense && defense.status !== "CANCELED" && (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {defense.status === "SCHEDULED" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setFinalizeModalOpen(true)}
                      className="cursor-pointer"
                      disabled={!canFinalizeDefense}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Finalizar Defesa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsRescheduleModalOpen(true)}
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Reagendar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setCancelModalOpen(true)}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar Defesa
                    </DropdownMenuItem>
                  </>
                )}

                {defense.status === "COMPLETED" &&
                  defense.documents &&
                  defense.documents.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Documentos
                        </p>
                      </div>
                      {defense.documents
                        .filter((doc) => doc.status !== "INACTIVE")
                        .map((doc, index) => {
                          const allApproved = doc.signatures?.every(
                            (sig) => sig.status === "APPROVED"
                          );
                          const hasPendingApprovals = doc.signatures?.some(
                            (sig) => sig.status === "PENDING"
                          );

                          return (
                            <div key={doc.id}>
                              {index > 0 && <DropdownMenuSeparator />}
                              <div className="px-2 py-1">
                                <p className="text-xs text-muted-foreground">
                                  Versão {doc.version}
                                </p>
                              </div>
                              {allApproved && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocForNewVersion({
                                      approvalId: doc.id,
                                      documentTitle: `${defense.title} - Versão ${doc.version}`,
                                    });
                                    setNewVersionModalOpen(true);
                                  }}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Nova Versão
                                </DropdownMenuItem>
                              )}
                              {hasPendingApprovals && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDocForNewVersion({
                                      approvalId: doc.id,
                                      documentTitle: `${defense.title} - Versão ${doc.version}`,
                                    });
                                    setNewVersionModalOpen(true);
                                  }}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Substituir Documento
                                </DropdownMenuItem>
                              )}
                            </div>
                          );
                        })}
                    </>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Informações da Defesa</h3>
              </div>
              <div className="space-y-2 text-sm">
                {defense.course && (
                  <div>
                    <p className="text-muted-foreground">Curso</p>
                    <p className="font-medium text-primary">
                      {defense.course.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Data e Hora</p>
                  <p className="font-medium">
                    {new Date(defense.defenseDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {defense.location && (
                  <div>
                    <p className="text-muted-foreground">Local</p>
                    <p className="font-medium">{defense.location}</p>
                  </div>
                )}
                {defense.finalGrade !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Nota Final</p>
                    <p className="font-medium">{defense.finalGrade}</p>
                  </div>
                )}
              </div>
            </div>

            {defense.advisor && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Orientador</h3>
                </div>
                <div className="text-sm p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium">{defense.advisor.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {defense.advisor.email}
                  </p>
                  {defense.advisor.specialization && (
                    <p className="text-muted-foreground text-xs">
                      {defense.advisor.specialization}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {defense.students && defense.students.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Alunos</h3>
                </div>
                <div className="space-y-2">
                  {defense.students.map((student) => (
                    <div
                      key={student.id}
                      className="text-sm p-3 rounded-lg border bg-muted/50"
                    >
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {student.email}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Matrícula: {student.registration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {defense.examBoard && defense.examBoard.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Banca Examinadora</h3>
                </div>
                <div className="space-y-2">
                  {defense.examBoard.map((member) => (
                    <div
                      key={member.id}
                      className="text-sm p-3 rounded-lg border bg-muted/50"
                    >
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {member.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {canViewDocuments &&
          defense.documents &&
          defense.documents.length > 0 && (
            <div>
              <Separator className="mb-6" />
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Documentos</h3>
              </div>
              <div className="space-y-4">
                {defense.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-6 rounded-lg border bg-muted/50 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Versão {doc.version}</p>
                          {doc.createdAt && (
                            <p className="text-xs text-muted-foreground">
                              Criado em{" "}
                              {new Date(doc.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          doc.status === "APPROVED" ? "secondary" : "default"
                        }
                      >
                        {doc.status === "APPROVED"
                          ? "Aprovado"
                          : doc.status === "PENDING"
                          ? "Pendente"
                          : "Inativo"}
                      </Badge>
                    </div>

                    {(doc.changeReason ||
                      doc.minutesCid ||
                      doc.evaluationCid ||
                      doc.blockchainRegisteredAt) && (
                      <div className="space-y-2 pt-2 border-t">
                        {doc.changeReason && (
                          <div className="flex items-start gap-2">
                            <p className="text-xs font-medium text-muted-foreground min-w-fit">
                              Motivo da mudança:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.changeReason}
                            </p>
                          </div>
                        )}
                        {doc.minutesCid && (
                          <div className="flex items-start gap-2">
                            <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                CID da Ata
                              </p>
                              <p className="text-xs text-muted-foreground break-all">
                                {doc.minutesCid}
                              </p>
                            </div>
                          </div>
                        )}
                        {doc.evaluationCid && (
                          <div className="flex items-start gap-2">
                            <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-muted-foreground">
                                CID da Avaliação
                              </p>
                              <p className="text-xs text-muted-foreground break-all">
                                {doc.evaluationCid}
                              </p>
                            </div>
                          </div>
                        )}
                        {doc.blockchainRegisteredAt && (
                          <div className="flex items-start gap-2">
                            <Shield className="h-3.5 w-3.5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Registrado no Ledger
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  doc.blockchainRegisteredAt
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {doc.signatures && doc.signatures.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-semibold mb-3">
                          Assinaturas:
                        </p>
                        <div className="grid gap-3">
                          {mergeSignaturesByEmail(doc.signatures).map(
                            (signature, index) => {
                              const isCurrentUser =
                                signature.email === user?.email;

                              return (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 rounded-lg bg-background border"
                                >
                                  {signature.status === "APPROVED" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                  ) : signature.status === "REJECTED" ? (
                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                  ) : (
                                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <p className="text-sm font-medium">
                                        {getRoleLabel(signature.roles)}
                                        {isCurrentUser && (
                                          <span className="text-muted-foreground ml-1">
                                            (você)
                                          </span>
                                        )}
                                      </p>
                                      <Badge
                                        variant={
                                          signature.status === "APPROVED"
                                            ? "secondary"
                                            : signature.status === "REJECTED"
                                            ? "destructive"
                                            : "default"
                                        }
                                        className="text-xs"
                                      >
                                        {signature.status === "APPROVED"
                                          ? "Aprovado"
                                          : signature.status === "REJECTED"
                                          ? "Rejeitado"
                                          : "Pendente"}
                                      </Badge>
                                    </div>
                                    {signature.email && (
                                      <p className="text-xs text-muted-foreground">
                                        {signature.email}
                                      </p>
                                    )}
                                    {signature.timestamp && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                          signature.timestamp
                                        ).toLocaleDateString("pt-BR", {
                                          day: "2-digit",
                                          month: "short",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    )}
                                    {signature.justification && (
                                      <p className="text-xs text-muted-foreground italic mt-2 pl-3 border-l-2">
                                        &ldquo;{signature.justification}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {canDownload && (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Downloads:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={async () => {
                              try {
                                const blob =
                                  await documentService.downloadDocument(
                                    doc.id,
                                    "minutes"
                                  );
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${defense.title}-Ata-v${doc.version}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                toast.success("Ata baixada com sucesso!");
                              } catch (error) {
                                console.error("Erro ao baixar Ata:", error);
                                toast.error("Erro ao baixar Ata", {
                                  description:
                                    "Não foi possível baixar o documento.",
                                });
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Ata
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={async () => {
                              try {
                                const blob =
                                  await documentService.downloadDocument(
                                    doc.id,
                                    "evaluation"
                                  );
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${defense.title}-Avaliacao-v${doc.version}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                toast.success("Avaliação baixada com sucesso!");
                              } catch (error) {
                                console.error(
                                  "Erro ao baixar Avaliação:",
                                  error
                                );
                                toast.error("Erro ao baixar Avaliação", {
                                  description:
                                    "Não foi possível baixar o documento.",
                                });
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Avaliação
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
        onSuccess={async () => {
          const updatedDefense = await defenseService.getDefenseById(
            defense.id
          );
          setDefense(updatedDefense);
        }}
      />

      <CancelDefenseDialog
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        defenseId={defense.id}
        onSuccess={async () => {
          const updatedDefense = await defenseService.getDefenseById(
            defense.id
          );
          setDefense(updatedDefense);
        }}
      />

      {selectedDocForNewVersion && (
        <NewVersionModal
          open={newVersionModalOpen}
          onOpenChange={setNewVersionModalOpen}
          documentTitle={selectedDocForNewVersion.documentTitle}
          approvalId={selectedDocForNewVersion.approvalId}
          onSuccess={async () => {
            const updatedDefense = await defenseService.getDefenseById(
              defense.id
            );
            setDefense(updatedDefense);
          }}
        />
      )}
    </DashboardLayout>
  );
}
