"use client"

import { useState, useEffect } from "react"
import { documentService } from "@/lib/services/document-service"
import type { Document } from "@/lib/types"

export function useDocuments(filters?: { status?: string; orientador?: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [filters?.status, filters?.orientador])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getAllDocuments(filters)
      setDocuments(data)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar documentos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createDocument = async (data: any) => {
    try {
      const newDocument = await documentService.createDocument(data)
      setDocuments((prev) => [...prev, newDocument])
      return newDocument
    } catch (err) {
      setError("Erro ao criar documento")
      throw err
    }
  }

  const approveDocument = async (id: string, approval: any) => {
    try {
      const updatedDocument = await documentService.approveDocument(id, approval)
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? updatedDocument : doc)))
      return updatedDocument
    } catch (err) {
      setError("Erro ao aprovar documento")
      throw err
    }
  }

  return {
    documents,
    loading,
    error,
    refetch: loadDocuments,
    createDocument,
    approveDocument,
  }
}
