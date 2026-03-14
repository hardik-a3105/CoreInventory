import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH
// ============================================
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  verifyOtp: (data) => apiClient.post('/auth/verify-otp', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
}

// ============================================
// PRODUCTS
// ============================================
export const productAPI = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  getCategories: () => apiClient.get('/products/categories'),
  createCategory: (data) => apiClient.post('/products/categories', data),
}

// ============================================
// RECEIPTS
// ============================================
export const receiptAPI = {
  getAll: (params) => apiClient.get('/receipts', { params }),
  getById: (id) => apiClient.get(`/receipts/${id}`),
  create: (data) => apiClient.post('/receipts', data),
  update: (id, data) => apiClient.put(`/receipts/${id}`, data),
  updateStatus: (id, status) => apiClient.put(`/receipts/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/receipts/${id}`),
}

// ============================================
// DELIVERIES
// ============================================
export const deliveryAPI = {
  getAll: (params) => apiClient.get('/deliveries', { params }),
  getById: (id) => apiClient.get(`/deliveries/${id}`),
  create: (data) => apiClient.post('/deliveries', data),
  update: (id, data) => apiClient.put(`/deliveries/${id}`, data),
  updateStatus: (id, status) => apiClient.put(`/deliveries/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/deliveries/${id}`),
}

// ============================================
// TRANSFERS
// ============================================
export const transferAPI = {
  getAll: (params) => apiClient.get('/transfers', { params }),
  getById: (id) => apiClient.get(`/transfers/${id}`),
  create: (data) => apiClient.post('/transfers', data),
  update: (id, data) => apiClient.put(`/transfers/${id}`, data),
  validate: (id) => apiClient.post(`/transfers/${id}/validate`),
  delete: (id) => apiClient.delete(`/transfers/${id}`),
}

// ============================================
// ADJUSTMENTS
// ============================================
export const adjustmentAPI = {
  getAll: (params) => apiClient.get('/adjustments', { params }),
  getById: (id) => apiClient.get(`/adjustments/${id}`),
  create: (data) => apiClient.post('/adjustments', data),
  update: (id, data) => apiClient.put(`/adjustments/${id}`, data),
  delete: (id) => apiClient.delete(`/adjustments/${id}`),
}

// ============================================
// WAREHOUSES
// ============================================
export const warehouseAPI = {
  getAll: () => apiClient.get('/warehouses'),
  getById: (id) => apiClient.get(`/warehouses/${id}`),
  create: (data) => apiClient.post('/warehouses', data),
  update: (id, data) => apiClient.put(`/warehouses/${id}`, data),
  delete: (id) => apiClient.delete(`/warehouses/${id}`),
}

// ============================================
// DASHBOARD
// ============================================
export const dashboardAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getMoveHistory: () => apiClient.get('/dashboard/move-history'),
}

export default apiClient
