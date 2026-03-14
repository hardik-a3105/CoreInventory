import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login with real API
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await authAPI.login({ email, password })
          const { token, user } = response.data.data
          localStorage.setItem('authToken', token)
          set({ 
            user, 
            role: user.role, 
            isAuthenticated: true,
            loading: false 
          })
          return user
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed'
          set({ error: message, loading: false })
          throw err
        }
      },

      // Signup with real API
      signup: async (name, email, password, role = 'staff') => {
        set({ loading: true, error: null })
        try {
          const response = await authAPI.signup({ name, email, password, role })
          const { token, user } = response.data.data
          localStorage.setItem('authToken', token)
          set({ 
            user, 
            role: user.role, 
            isAuthenticated: true,
            loading: false 
          })
          return user
        } catch (err) {
          const message = err.response?.data?.message || 'Signup failed'
          set({ error: message, loading: false })
          throw err
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('authToken')
        set({ user: null, role: null, isAuthenticated: false, error: null })
      },

      setRole: (r) => set({ role: r }),
    }),
    { name: 'ci-auth' }
  )
)
