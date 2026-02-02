"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Textarea } from "@/components/primitives/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";

interface RejectionInfo {
  approvalId: string;
  documentTitle: string;
  rejectionReason: string;
  approverName: string;
}

interface ReconsiderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejection: RejectionInfo | null;
  reason: string;
  onReasonChange: (reason: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export function ReconsiderModal({
  open,
  onOpenChange,
  rejection,
  reason,
  onReasonChange,
  submitting,
  onSubmit,
  onClose,
}: ReconsiderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Reconsideração</DialogTitle>
          <DialogDescription>
            Você está solicitando que o avaliador reconsidere a rejeição deste
            documento.
          </DialogDescription>
        </DialogHeader>

        {rejection && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Documento</label>
              <p className="text-sm text-muted-foreground">
                {rejection.documentTitle}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rejeitado por</label>
              <p className="text-sm font-medium">{rejection.approverName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo da rejeição</label>
              <p className="text-sm text-muted-foreground italic border-l-2 border-red-400 pl-3 py-2 bg-red-50 dark:bg-red-950/20 rounded">
                &ldquo;{rejection.rejectionReason}&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Justificativa para reconsideração{" "}
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Explique por que você acredita que o documento deveria ser reconsiderado..."
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
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
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting || !reason.trim()}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            {submitting ? "Enviando..." : "Solicitar Reconsideração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
