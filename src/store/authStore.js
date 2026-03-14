import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      login: (u) => set({ user: u, role: u.role, isAuthenticated: true }),
      setRole: (r) => set({ role: r }),
      logout: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    { name: 'ci-auth' }
  )
)
