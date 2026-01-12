export interface Department {
  id: string
  name: string
  code?: string
  location?: string
  contact?: {
    email?: string
    phone?: string
  }
  createdAt: string
  updatedAt: string
}
