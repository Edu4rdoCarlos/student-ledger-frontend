export type SignatureStatus = "PENDING" | "APPROVED" | "REJECTED";
export type DocumentStatus = "PENDING" | "APPROVED" | "INACTIVE";
export type DefenseResult = "PENDING" | "APPROVED" | "FAILED";

export const SIGNATURE_STATUS_LABELS: Record<SignatureStatus, string> = {
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  PENDING: "Pendente",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  INACTIVE: "Inativo",
};

export const DEFENSE_RESULT_LABELS: Record<DefenseResult, string> = {
  APPROVED: "Aprovado",
  FAILED: "Reprovado",
  PENDING: "Pendente",
};

export const SIGNATURE_STATUS_VARIANTS: Record<SignatureStatus, "secondary" | "destructive" | "default"> = {
  APPROVED: "secondary",
  REJECTED: "destructive",
  PENDING: "default",
};

export function getSignatureStatusLabel(status: SignatureStatus): string {
  return SIGNATURE_STATUS_LABELS[status] || status;
}

export function getDocumentStatusLabel(status: string): string {
  return DOCUMENT_STATUS_LABELS[status as DocumentStatus] || status;
}

export function getSignatureStatusVariant(status: SignatureStatus): "secondary" | "destructive" | "default" {
  return SIGNATURE_STATUS_VARIANTS[status] || "default";
}

export function getDefenseResultLabel(result: string): string {
  return DEFENSE_RESULT_LABELS[result as DefenseResult] || result;
}
