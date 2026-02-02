"use client";

import { FileText, CalendarClock, X, MoreVertical, Upload } from "lucide-react";
import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu";
import type { Defense } from "@/lib/types/defense";

interface DefenseActionsMenuProps {
  defense: Defense;
  onFinalize: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onNewVersion: (approvalId: string, documentTitle: string, isReplacement: boolean) => void;
}

export function DefenseActionsMenu({
  defense,
  onFinalize,
  onReschedule,
  onCancel,
  onNewVersion,
}: DefenseActionsMenuProps) {
  return (
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
                onClick={onFinalize}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Finalizar Defesa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReschedule}>
                <CalendarClock className="mr-2 h-4 w-4" />
                Reagendar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onCancel}
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
                            onClick={() =>
                              onNewVersion(
                                doc.id,
                                `${defense.title} - Versão ${doc.version}`,
                                false
                              )
                            }
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Nova Versão
                          </DropdownMenuItem>
                        )}
                        {hasPendingApprovals && (
                          <DropdownMenuItem
                            onClick={() =>
                              onNewVersion(
                                doc.id,
                                `${defense.title} - Versão ${doc.version}`,
                                true
                              )
                            }
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
  );
}
