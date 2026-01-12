import { documentRepository } from "@/lib/repositories/document-repository"
import type { DocumentFormData, ApprovalFormData } from "@/lib/validations/document"

export const documentService = {
  async getAllDocuments(filters?: { status?: string; orientador?: string }) {
    return documentRepository.getAll(filters)
  },

  async getDocumentById(id: string) {
    return documentRepository.getById(id)
  },

  async getDocumentsByStudent(studentId: string) {
    return documentRepository.getByStudentId(studentId)
  },

  async createDocument(data: DocumentFormData) {
    // Aqui você pode adicionar lógica para calcular o hash do arquivo
    return documentRepository.create(data)
  },

  async approveDocument(id: string, approval: ApprovalFormData & { userId: string; userName: string; role: string }) {
    return documentRepository.approve(id, approval)
  },

  async verifyDocumentHash(hash: string) {
    return documentRepository.verifyHash(hash)
  },

  async validateDocument(file: File) {
    return documentRepository.validateDocument(file)
  },

  async downloadDocument(id: string) {
    return documentRepository.download(id)
  },

  calculateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer
          const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
          resolve(hashHex)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  },
}
