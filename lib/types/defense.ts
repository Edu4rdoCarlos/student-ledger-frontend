export type DefenseResult = "PENDING" | "APPROVED" | "FAILED"
export type DefenseStatus = "SCHEDULED" | "COMPLETED" | "CANCELED"
export type DocumentStatus = "PENDING" | "APPROVED" | "INACTIVE"
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED"
export type ApprovalRole = "COORDINATOR" | "ADVISOR" | "STUDENT"

export interface DefenseStudent {
  id: string
  name: string
  email: string
  registration: string
}

export interface DefenseAdvisor {
  id: string
  name: string
  email: string
  specialization: string
}

export interface DefenseExamBoardMember {
  id: string
  name: string
  email: string
}

export interface DocumentApproval {
  id: string
  role: ApprovalRole
  status: ApprovalStatus
  justification?: string
  approvedAt?: string
  approverId?: string
  approver?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface DefenseDocument {
  id: string
  type: string
  version: number
  documentHash?: string
  documentCid?: string
  status: DocumentStatus
  blockchainTxId?: string
  blockchainRegisteredAt?: string
  defenseId: string
  previousVersionId: string | null
  createdAt: string
  updatedAt: string
  downloadUrl?: string
  approvals?: DocumentApproval[]
}

export interface Defense {
  id: string
  title: string
  defenseDate: string
  location: string
  finalGrade: number
  result: DefenseResult
  status: DefenseStatus
  advisor: DefenseAdvisor
  students: DefenseStudent[]
  examBoard: DefenseExamBoardMember[]
  documents: DefenseDocument[]
  createdAt: string
  updatedAt: string
}

export interface StudentDefense {
  studentRegistration: string
  title: string
  defenseDate: string
  location?: string
  finalGrade: number
  result: DefenseResult
  reason: string
  registeredBy: string
  defenseStatus: DefenseStatus
  validatedAt: string
  advisor?: {
    id: string
    name: string
    email: string
    specialization: string
  }
  examBoard?: Array<{
    name: string
    email: string
  }>
  coStudents?: Array<{
    id: string
    registration: string
    name: string
    email: string
  }>
  signatures: Array<{
    role: string
    email: string
    timestamp: string
    status: ApprovalStatus
    justification?: string
  }>
  documents: Array<{
    id: string
    version: number
    status: DocumentStatus
    blockchainTxId?: string
    blockchainRegisteredAt?: string
    createdAt: string
    downloadUrl?: string
    changeReason?: string
  }>
}

export interface AdvisorDefense {
  id: string
  title: string
  defenseDate: string
  location: string
  finalGrade: number
  result: DefenseResult
  status: DefenseStatus
  students: DefenseStudent[]
  examBoard: DefenseExamBoardMember[]
  createdAt: string
  updatedAt: string
}
