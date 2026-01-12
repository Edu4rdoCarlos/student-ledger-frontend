export * from "./user"
export * from "./department"
export * from "./course"
export * from "./defense"

export type DocumentStatus = "pendente" | "aprovado" | "inativo"

export type DocumentType = "ata" | "ficha"

import type { StudentDefense } from "./defense"

export interface Student {
  id?: string
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
  defenses?: StudentDefense[]
  defensesCount?: number
  status?: "NO_DEFENSE" | "APPROVED" | "FAILED" | "PENDING" | "UNDER_APPROVAL"
  createdAt: string
  updatedAt: string
}

export interface Advisor {
  id: string
  userId: string
  name: string
  email: string
  specialization: string
  course: {
    id: string
    name: string
    code: string
  }
  hasActiveAdvisorship: boolean
  activeAdvisorshipsCount: number
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
