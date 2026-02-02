"use client";

import { FileText, CheckCircle2, Clock, XCircle, Download, Hash, Shield } from "lucide-react";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { Separator } from "@/components/primitives/separator";
import { documentService } from "@/lib/services/document-service";
import { getRoleLabelFromArray } from "@/lib/utils/role-utils";
import {
  type SignatureStatus,
  SIGNATURE_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  SIGNATURE_STATUS_VARIANTS,
} from "@/lib/utils/status-utils";
import { toast } from "sonner";
import type { Defense } from "@/lib/types/defense";

interface Signature {
  role: string;
  email: string;
  timestamp: string;
  status: SignatureStatus;
  justification?: string;
}

interface MergedSignature {
  roles: string[];
  email: string;
  timestamp: string;
  status: SignatureStatus;
  justification?: string;
}

interface Document {
  id: string;
  version: number;
  status: string;
  createdAt?: string;
  changeReason?: string;
  minutesCid?: string;
  evaluationCid?: string;
  blockchainRegisteredAt?: string;
  signatures?: Signature[];
}

interface DefenseDocumentsSectionProps {
  defense: Defense;
  canDownload: boolean;
  currentUserEmail?: string;
}

function mergeSignaturesByEmail(signatures?: Signature[]): MergedSignature[] {
  if (!signatures) return [];

  const signatureMap = new Map<string, MergedSignature>();

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

      if (sig.timestamp && (!existing.timestamp || new Date(sig.timestamp) > new Date(existing.timestamp))) {
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
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("pt-BR", options);
}

function DocumentHeader({ doc }: { doc: Document }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-primary" />
        <div>
          <p className="font-semibold">Versão {doc.version}</p>
          {doc.createdAt && (
            <p className="text-xs text-muted-foreground">
              Criado em {formatDate(doc.createdAt, { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
      <Badge variant={doc.status === "APPROVED" ? "secondary" : "default"}>
        {DOCUMENT_STATUS_LABELS[doc.status as keyof typeof DOCUMENT_STATUS_LABELS] || doc.status}
      </Badge>
    </div>
  );
}

function DocumentMetadata({ doc }: { doc: Document }) {
  const hasMetadata = doc.changeReason || doc.minutesCid || doc.evaluationCid || doc.blockchainRegisteredAt;

  if (!hasMetadata) return null;

  return (
    <div className="space-y-2 pt-2 border-t">
      {doc.changeReason && (
        <div className="flex items-start gap-2">
          <p className="text-xs font-medium text-muted-foreground min-w-fit">Motivo da mudança:</p>
          <p className="text-xs text-muted-foreground">{doc.changeReason}</p>
        </div>
      )}

      {doc.minutesCid && (
        <CidInfo label="CID da Ata" value={doc.minutesCid} />
      )}

      {doc.evaluationCid && (
        <CidInfo label="CID da Avaliação" value={doc.evaluationCid} />
      )}

      {doc.blockchainRegisteredAt && (
        <div className="flex items-start gap-2">
          <Shield className="h-3.5 w-3.5 text-green-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Registrado no Ledger</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(doc.blockchainRegisteredAt, {
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
  );
}

function CidInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground break-all">{value}</p>
      </div>
    </div>
  );
}

function SignatureStatusIcon({ status }: { status: SignatureStatus }) {
  const icons = {
    APPROVED: <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />,
    REJECTED: <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />,
    PENDING: <Clock className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />,
  };
  return icons[status];
}

function SignatureStatusBadge({ status }: { status: SignatureStatus }) {
  return (
    <Badge variant={SIGNATURE_STATUS_VARIANTS[status]} className="text-xs">
      {SIGNATURE_STATUS_LABELS[status]}
    </Badge>
  );
}

function SignatureItem({ signature, isCurrentUser }: { signature: MergedSignature; isCurrentUser: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background border">
      <SignatureStatusIcon status={signature.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-medium">
            {getRoleLabelFromArray(signature.roles)}
            {isCurrentUser && <span className="text-muted-foreground ml-1">(você)</span>}
          </p>
          <SignatureStatusBadge status={signature.status} />
        </div>

        {signature.email && (
          <p className="text-xs text-muted-foreground">{signature.email}</p>
        )}

        {signature.timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(signature.timestamp, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
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

function SignaturesList({ signatures, currentUserEmail }: { signatures?: Signature[]; currentUserEmail?: string }) {
  const mergedSignatures = mergeSignaturesByEmail(signatures);

  if (mergedSignatures.length === 0) return null;

  return (
    <div className="pt-2 border-t">
      <p className="text-sm font-semibold mb-3">Aprovações:</p>
      <div className="grid gap-3">
        {mergedSignatures.map((signature, index) => (
          <SignatureItem
            key={`${signature.email}-${index}`}
            signature={signature}
            isCurrentUser={signature.email === currentUserEmail}
          />
        ))}
      </div>
    </div>
  );
}

function DocumentDownloads({
  docId,
  version,
  defenseTitle,
  onDownload,
}: {
  docId: string;
  version: number;
  defenseTitle: string;
  onDownload: (docId: string, type: "minutes" | "evaluation", version: number) => void;
}) {
  return (
    <div className="pt-2 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Downloads:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => onDownload(docId, "minutes", version)}
        >
          <Download className="h-4 w-4" />
          Ata
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={() => onDownload(docId, "evaluation", version)}
        >
          <Download className="h-4 w-4" />
          Avaliação
        </Button>
      </div>
    </div>
  );
}

function DocumentCard({
  doc,
  defenseTitle,
  canDownload,
  currentUserEmail,
  onDownload,
}: {
  doc: Document;
  defenseTitle: string;
  canDownload: boolean;
  currentUserEmail?: string;
  onDownload: (docId: string, type: "minutes" | "evaluation", version: number) => void;
}) {
  return (
    <div className="p-6 rounded-lg border bg-muted/50 space-y-4">
      <DocumentHeader doc={doc} />
      <DocumentMetadata doc={doc} />
      <SignaturesList signatures={doc.signatures} currentUserEmail={currentUserEmail} />
      {canDownload && (
        <DocumentDownloads
          docId={doc.id}
          version={doc.version}
          defenseTitle={defenseTitle}
          onDownload={onDownload}
        />
      )}
    </div>
  );
}

export function DefenseDocumentsSection({
  defense,
  canDownload,
  currentUserEmail,
}: DefenseDocumentsSectionProps) {
  if (!defense.documents || defense.documents.length === 0) {
    return null;
  }

  const handleDownload = async (docId: string, type: "minutes" | "evaluation", version: number) => {
    const typeLabels = { minutes: "Ata", evaluation: "Avaliação" };
    const label = typeLabels[type];

    try {
      const blob = await documentService.downloadDocument(docId, type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${defense.title}-${label}-v${version}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${label} baixada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao baixar ${label}:`, error);
      toast.error(`Erro ao baixar ${label}`, {
        description: "Não foi possível baixar o documento.",
      });
    }
  };

  return (
    <div>
      <Separator className="mb-6" />
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold">Documentos</h3>
      </div>
      <div className="space-y-4">
        {defense.documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            defenseTitle={defense.title}
            canDownload={canDownload}
            currentUserEmail={currentUserEmail}
            onDownload={handleDownload}
          />
        ))}
      </div>
    </div>
  );
}
