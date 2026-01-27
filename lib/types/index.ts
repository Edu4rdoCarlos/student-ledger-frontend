export * from "./user"
export * from "./course"
export * from "./defense"

export type DocumentStatus = "pendente" | "aprovado" | "inativo"

export type DocumentType = "ata" | "ficha"

export interface Student {
  userId: string
  matricula?: string
  registration: string
  name: string
  email: string
  course: {
    id: string
    name: string
    code: string
  }
  orientadorId?: string
  defenseIds?: string[]
  defensesCount?: number
  defenseStatus?: "SCHEDULED" | "COMPLETED" | "CANCELED"
  createdAt: string
  updatedAt: string
}

export interface Advisor {
  userId: string
  name: string
  email: string
  specialization: string
  course: {
    id: string
    name: string
    code: string
  }
  isActive: boolean
  hasActiveAdvisorship: boolean
  activeAdvisorshipsCount: number
  defenseIds?: string[]
  createdAt: string
  updatedAt: string
}

export interface Coordinator {
  userId: string
  name: string
  email: string
  course: {
    id: string
    name: string
    code: string
  } | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Orientador {
  id: string
  name: string
  email: string
  department: string
  createdAt: string
}

export interface Document {
  id: string
  type: DocumentType
  title: string
  studentId: string
  studentName: string
  orientadorName: string
  course: string
  hash: string
  status: DocumentStatus
  version: number
  createdAt: string
  updatedAt: string
  inactivatedAt?: string
  inactivationReason?: string
  approvals: Approval[]
  pendingApprovals: string[]
}

export interface Approval {
  userId: string
  userName: string
  role: string
  approved: boolean
  justification?: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  peers: string[]
  responsavel: string
  createdAt: string
}

export interface Notification {
  id: string
  type: "approval_pending" | "document_approved" | "document_rejected"
  documentId: string
  message: string
  read: boolean
  createdAt: string
}

export interface PaginationMetadata {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface DashboardSummary {
  totalDocuments: number
  pendingDocuments: number
  approvedDocuments: number
  totalStudents: number
}

export type ValidatedDocumentType = "minutes" | "evaluation"

export type ValidationStatus = "NOT_FOUND" | "PENDING" | "APPROVED" | "INACTIVE"

export interface DocumentValidationResponse {
  isValid: boolean
  status: ValidationStatus
  document?: {
    id: string
    documentType: ValidatedDocumentType
    minutesHash?: string
    minutesCid?: string
    evaluationHash?: string
    evaluationCid?: string
    status: "PENDING" | "APPROVED" | "INACTIVE"
    defenseInfo?: {
      students: string[]
      advisor: string
      course: string
    }
  }
}
