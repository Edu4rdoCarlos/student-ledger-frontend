import { documentRepository } from "@/lib/repositories/document-repository"
import type { ValidatedDocumentType } from "@/lib/types"

export const documentService = {
  async verifyDocumentHash(hash: string) {
    return documentRepository.verifyHash(hash)
  },

  async validateDocument(file: File) {
    return documentRepository.validateDocument(file)
  },

  async downloadDocument(id: string, documentType?: ValidatedDocumentType) {
    return documentRepository.download(id, documentType)
  },
}
