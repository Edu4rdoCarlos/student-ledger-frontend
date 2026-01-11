export type DefenseResult = "PENDING" | "APPROVED" | "REJECTED"
export type DefenseStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED"

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

export interface DefenseDocument {
  id: string
  type: string
  version: number
  documentHash: string
  documentCid: string
  status: string
  blockchainTxId: string
  blockchainRegisteredAt: string
  defenseId: string
  previousVersionId: string | null
  createdAt: string
  updatedAt: string
  downloadUrl: string
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
