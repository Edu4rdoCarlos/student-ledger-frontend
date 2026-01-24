import type { Document, DocumentValidationResponse, ValidatedDocumentType } from "@/lib/types"
import type { DocumentFormData, ApprovalFormData } from "@/lib/validations/document"
import { apiClient } from "@/lib/api/client"

export interface DocumentRepository {
  getAll(filters?: { status?: string; orientador?: string }): Promise<Document[]>
  getById(id: string): Promise<Document>
  getByStudentId(studentId: string): Promise<Document[]>
  create(data: DocumentFormData): Promise<Document>
  approve(
    id: string,
    approval: ApprovalFormData & { userId: string; userName: string; role: string },
  ): Promise<Document>
  verifyHash(hash: string): Promise<DocumentValidationResponse | null>
  validateDocument(file: File): Promise<DocumentValidationResponse | null>
  download(id: string, documentType?: ValidatedDocumentType): Promise<Blob>
  uploadNewVersion(id: string, file: File, documentType: ValidatedDocumentType, reason: string, finalGrade?: number): Promise<Document>
}

export const documentRepository: DocumentRepository = {
  async getAll(filters) {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.orientador) params.append('orientador', filters.orientador)

    const query = params.toString()
    return apiClient.get<Document[]>(`/documents${query ? `?${query}` : ''}`)
  },

  async getById(id: string) {
    return apiClient.get<Document>(`/documents/${id}`)
  },

  async getByStudentId(studentId: string) {
    return apiClient.get<Document[]>(`/documents?studentId=${studentId}`)
  },

  async create(data: DocumentFormData) {
    return apiClient.post<Document>('/documents', data)
  },

  async approve(id: string, approval) {
    return apiClient.patch<Document>(`/documents/${id}/approve`, approval)
  },

  async verifyHash(hash: string) {
    const formData = new FormData()
    formData.append('hash', hash)

    try {
      const response = await apiClient.uploadFormData<{ data: DocumentValidationResponse }>('/documents/validate', formData)
      return response.data
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  },

  async validateDocument(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.uploadFormData<{ data: DocumentValidationResponse }>('/documents/validate', formData)
      return response.data
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  },

  async download(id: string, documentType?: ValidatedDocumentType) {
    const typeParam = documentType ? `?type=${documentType}` : ''
    return apiClient.downloadBlob(`/documents/${id}/download${typeParam}`)
  },

  async uploadNewVersion(id: string, file: File, documentType: ValidatedDocumentType, reason: string, finalGrade?: number) {
    const formData = new FormData()
    formData.append('document', file)
    formData.append('documentType', documentType)
    formData.append('changeReason', reason)
    if (finalGrade !== undefined) {
      formData.append('finalGrade', finalGrade.toString())
    }

    return apiClient.uploadFormData<Document>(`/documents/${id}/versions`, formData)
  },
}
