import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api/client"
import { authRepository } from "@/lib/repositories/auth-repository"
import { userRepository } from "@/lib/repositories/user-repository"

function setSessionCookie(hasSession: boolean) {
  if (typeof document === "undefined") return
  if (hasSession) {
    document.cookie = "has-session=true; path=/; SameSite=Lax"
  } else {
    document.cookie = "has-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: User) => void
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken) => {
        apiClient.setAccessToken(accessToken)
        setSessionCookie(true)
        set({ user, accessToken, isAuthenticated: true, isLoading: false })
      },

      setAccessToken: (accessToken) => {
        apiClient.setAccessToken(accessToken)
        set({ accessToken })
      },

      setUser: (user) => {
        set({ user })
      },

      fetchUser: async () => {
        const state = get()
        if (!state.accessToken) return

        try {
          const user = await userRepository.getMe()
          set({ user })
        } catch (error) {
          console.error("Failed to fetch user:", error)
        }
      },

      logout: async () => {
        try {
          await authRepository.logout()
        } catch {
        }
        apiClient.setAccessToken(null)
        setSessionCookie(false)
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false })
      },

      initialize: () => {
        const state = get()
        if (state.accessToken) {
          apiClient.setAccessToken(state.accessToken)
        }
        set({ isLoading: false })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          apiClient.setAccessToken(state.accessToken)
          setSessionCookie(true)
        } else {
          setSessionCookie(false)
        }
        state?.initialize()
      },
    },
  ),
)

if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout()
    window.location.href = "/login"
  })
}
