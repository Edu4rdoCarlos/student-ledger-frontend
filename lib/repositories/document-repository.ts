import type { Document } from "@/lib/types"
import type { DocumentFormData, ApprovalFormData } from "@/lib/validations/document"

export interface DocumentRepository {
  getAll(filters?: { status?: string; orientador?: string }): Promise<Document[]>
  getById(id: string): Promise<Document>
  getByStudentId(studentId: string): Promise<Document[]>
  create(data: DocumentFormData): Promise<Document>
  approve(
    id: string,
    approval: ApprovalFormData & { userId: string; userName: string; role: string },
  ): Promise<Document>
  verifyHash(hash: string): Promise<Document | null>
  validateDocument(file: File): Promise<Document | null>
  download(id: string): Promise<Blob>
  uploadNewVersion(id: string, file: File, reason: string): Promise<Document>
}

export const documentRepository: DocumentRepository = {
  async getAll(filters) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const allDocs: Document[] = [
      {
        id: "1",
        type: "ata",
        title: "Ata de Defesa - TCC Final",
        studentId: "1",
        studentName: "Maria Santos",
        orientadorName: "Dr. Carlos Souza",
        course: "Engenharia de Software",
        hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
        status: "pendente",
        version: 1,
        createdAt: "2024-12-20T10:00:00Z",
        updatedAt: "2024-12-20T10:00:00Z",
        approvals: [
          {
            userId: "1",
            userName: "Dr. Carlos Souza",
            role: "orientador",
            approved: true,
            createdAt: "2024-12-21T09:00:00Z",
          },
        ],
        pendingApprovals: ["coordenador", "aluno"],
      },
      {
        id: "2",
        type: "ficha",
        title: "Ficha de Avaliação - Pedro Oliveira",
        studentId: "2",
        studentName: "Pedro Oliveira",
        orientadorName: "Dra. Ana Paula",
        course: "Ciência da Computação",
        hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3",
        status: "aprovado",
        version: 1,
        createdAt: "2024-12-15T14:00:00Z",
        updatedAt: "2024-12-18T16:00:00Z",
        approvals: [
          {
            userId: "2",
            userName: "Dra. Ana Paula",
            role: "orientador",
            approved: true,
            createdAt: "2024-12-16T10:00:00Z",
          },
          {
            userId: "3",
            userName: "Prof. Roberto Lima",
            role: "coordenador",
            approved: true,
            createdAt: "2024-12-17T11:00:00Z",
          },
        ],
        pendingApprovals: [],
      },
    ]

    if (!filters) return allDocs

    return allDocs.filter((doc) => {
      if (filters.status && doc.status !== filters.status) return false
      if (filters.orientador && doc.orientadorName !== filters.orientador) return false
      return true
    })
  },

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id,
      type: "ata",
      title: "Ata de Defesa - TCC Final",
      studentId: "1",
      studentName: "Maria Santos",
      orientadorName: "Dr. Carlos Souza",
      course: "Engenharia de Software",
      hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
      status: "pendente",
      version: 1,
      createdAt: "2024-12-20T10:00:00Z",
      updatedAt: "2024-12-20T10:00:00Z",
      approvals: [],
      pendingApprovals: ["orientador", "coordenador", "aluno"],
    }
  },

  async getByStudentId(studentId: string) {
    await new Promise((resolve) => setTimeout(resolve, 600))

    return [
      {
        id: "1",
        type: "ata",
        title: "Ata de Defesa - TCC Final",
        studentId,
        studentName: "Maria Santos",
        orientadorName: "Dr. Carlos Souza",
        course: "Engenharia de Software",
        hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
        status: "pendente",
        version: 1,
        createdAt: "2024-12-20T10:00:00Z",
        updatedAt: "2024-12-20T10:00:00Z",
        approvals: [],
        pendingApprovals: ["orientador", "coordenador", "aluno"],
      },
    ]
  },

  async create(data: DocumentFormData) {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    return {
      id: String(Date.now()),
      type: data.type,
      title: data.title,
      studentId: data.studentId,
      studentName: "Maria Santos",
      orientadorName: "Dr. Carlos Souza",
      course: data.course,
      hash: mockHash,
      status: "pendente",
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvals: [],
      pendingApprovals: ["orientador", "coordenador", "aluno"],
    }
  },

  async approve(id: string, approval) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id,
      type: "ata",
      title: "Ata de Defesa - TCC Final",
      studentId: "1",
      studentName: "Maria Santos",
      orientadorName: "Dr. Carlos Souza",
      course: "Engenharia de Software",
      hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
      status: approval.approved ? "aprovado" : "pendente",
      version: 1,
      createdAt: "2024-12-20T10:00:00Z",
      updatedAt: new Date().toISOString(),
      approvals: [
        {
          userId: approval.userId,
          userName: approval.userName,
          role: approval.role as any,
          approved: approval.approved,
          justification: approval.justification,
          createdAt: new Date().toISOString(),
        },
      ],
      pendingApprovals: [],
    }
  },

  async verifyHash(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (hash === "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2") {
      return {
        id: "1",
        type: "ata",
        title: "Ata de Defesa - TCC Final",
        studentId: "1",
        studentName: "Maria Santos",
        orientadorName: "Dr. Carlos Souza",
        course: "Engenharia de Software",
        hash,
        status: "aprovado",
        version: 1,
        createdAt: "2024-12-20T10:00:00Z",
        updatedAt: "2024-12-20T10:00:00Z",
        approvals: [],
        pendingApprovals: [],
      }
    }

    return null
  },

  async validateDocument(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/documents/validate', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Erro ao validar documento')
    }

    return response.json()
  },

  async download(id: string) {
    const response = await fetch(`/api/documents/${id}/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao baixar documento')
    }

    return response.blob()
  },

  async uploadNewVersion(id: string, file: File, reason: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('reason', reason)

    const response = await fetch(`/api/documents/${id}/versions`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Erro ao enviar nova versão do documento')
    }

    return response.json()
  },
}
