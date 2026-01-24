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
  isActive?: boolean
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

export interface DocumentSignature {
  role: string
  email: string
  timestamp: string
  status: ApprovalStatus
  justification?: string
}

export type DocumentType = "minutes" | "evaluation"

export interface DefenseDocument {
  id: string
  type?: string
  version: number
  // Ata (Minutes)
  minutesHash?: string
  minutesCid?: string
  // Avaliação de Desempenho (Evaluation)
  evaluationHash?: string
  evaluationCid?: string
  status: DocumentStatus
  blockchainTxId?: string
  blockchainRegisteredAt?: string
  defenseId?: string
  previousVersionId?: string | null
  createdAt: string
  updatedAt?: string
  approvals?: DocumentApproval[]
  signatures?: DocumentSignature[]
  changeReason?: string
}

export interface Defense {
  id: string
  title: string
  defenseDate: string
  result: DefenseResult
  status: DefenseStatus
  advisorName: string
  studentNames: string[]
  location?: string
  finalGrade?: number
  advisor?: DefenseAdvisor
  students?: DefenseStudent[]
  examBoard?: DefenseExamBoardMember[]
  documents?: DefenseDocument[]
  signatures?: DocumentSignature[]
  course?: {
    id: string
    code: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
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
