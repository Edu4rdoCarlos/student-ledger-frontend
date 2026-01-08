const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
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
        credentials: "include", // Envia o refreshToken cookie httpOnly
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

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    if (!skipAuth && this.accessToken) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: "include", // Sempre envia cookies (para o refreshToken)
    })

    // Se receber 401 e não for uma requisição sem auth, tenta refresh
    if (response.status === 401 && !skipAuth) {
      const newToken = await this.refreshToken()

      if (newToken) {
        // Retry com o novo token
        ;(headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
          credentials: "include",
        })
      } else {
        // Refresh falhou - dispatch evento para logout
        window.dispatchEvent(new CustomEvent("auth:logout"))
        throw new Error("Sessão expirada")
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Métodos de conveniência
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
}

export const apiClient = new ApiClient()
