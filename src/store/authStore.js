import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, role: user.role, isAuthenticated: true }),
      setRole: (r) => set({ role: r }),
      logout: () => set({ user: null, token: null, role: null, isAuthenticated: false }),
    }),
    { name: 'ci-auth' }
  )
)
