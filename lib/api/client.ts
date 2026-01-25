import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
  skipToast?: boolean
}

class ApiClient {
  private accessToken: string | null = null

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  getAccessToken() {
    return this.accessToken
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      this.accessToken = data.accessToken
      return data.accessToken
    } catch {
      return null
    }
  }

  private showErrorToast(message: string, skipToast?: boolean) {
    if (skipToast || typeof window === "undefined") return

    toast.error(message, {
      description: "Por favor, tente novamente mais tarde.",
      duration: 5000,
    })
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, skipToast = false, ...fetchOptions } = options

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    if (!skipAuth && this.accessToken) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`
    }

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: "include",
      })

      if (response.status === 401 && !skipAuth) {
        const newToken = await this.refreshToken()

        if (newToken) {
          ;(headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchOptions,
            headers,
            credentials: "include",
          })
        } else {
          window.dispatchEvent(new CustomEvent("auth:logout"))
          throw new Error("Sessão expirada")
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        this.showErrorToast("Serviço indisponível", skipToast)
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.")
      }

      if (error instanceof Error &&
          (error.message.toLowerCase().includes("network") ||
           error.message.toLowerCase().includes("failed to fetch"))) {
        this.showErrorToast("Serviço indisponível", skipToast)
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.")
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error("Erro desconhecido")
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  async downloadBlob(endpoint: string, options: RequestOptions = {}): Promise<Blob> {
    const { skipAuth = false, ...fetchOptions } = options

    const headers: HeadersInit = {
      ...fetchOptions.headers,
    }

    if (!skipAuth && this.accessToken) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      method: "GET",
      headers,
      credentials: "include",
    })

    if (response.status === 401 && !skipAuth) {
      const newToken = await this.refreshToken()

      if (newToken) {
        ;(headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchOptions,
          method: "GET",
          headers,
          credentials: "include",
        })
      } else {
        window.dispatchEvent(new CustomEvent("auth:logout"))
        throw new Error("Sessão expirada")
      }
    }

    if (!response.ok) {
      throw new Error(`Erro ao baixar arquivo: HTTP ${response.status}`)
    }

    return response.blob()
  }

  async uploadFormData<T>(endpoint: string, formData: FormData, options: Omit<RequestOptions, 'body'> = {}): Promise<T> {
    const { skipAuth = false, skipToast = false, ...fetchOptions } = options

    const headers: HeadersInit = {
      ...fetchOptions.headers,
    }

    if (!skipAuth && this.accessToken) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`
    }

    try {
      let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      })

      if (response.status === 401 && !skipAuth) {
        const newToken = await this.refreshToken()

        if (newToken) {
          ;(headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchOptions,
            method: "POST",
            headers,
            body: formData,
            credentials: "include",
          })
        } else {
          window.dispatchEvent(new CustomEvent("auth:logout"))
          throw new Error("Sessão expirada")
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        this.showErrorToast("Serviço indisponível", skipToast)
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.")
      }

      if (error instanceof Error &&
          (error.message.toLowerCase().includes("network") ||
           error.message.toLowerCase().includes("failed to fetch"))) {
        this.showErrorToast("Serviço indisponível", skipToast)
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.")
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error("Erro desconhecido")
    }
  }
}

export const apiClient = new ApiClient()
