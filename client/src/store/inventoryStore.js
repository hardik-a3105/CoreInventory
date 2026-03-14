import { create } from 'zustand'
import {
  dashboardAPI,
  productAPI,
  receiptAPI,
  deliveryAPI,
  transferAPI,
  adjustmentAPI,
  warehouseAPI,
} from '../services/api'

export const useInventoryStore = create((set) => ({
  // State
  kpis: null,
  operations: [],
  products: [],
  categories: [],
  receipts: [],
  deliveries: [],
  transfers: [],
  adjustments: [],
  warehouses: [],
  stockHealth: [],
  loading: false,
  error: null,

  // DASHBOARD
  fetchDashboard: async () => {
    set({ loading: true, error: null })
    try {
      const response = await dashboardAPI.getDashboard()
      const data = response.data.data
      set({
        kpis: data.kpis,
        operations: data.recentActivity || [],
        loading: false,
      })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  // PRODUCTS
  fetchProducts: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await productAPI.getAll(params)
      set({ products: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const response = await productAPI.getCategories()
      set({ categories: response.data.data || [] })
    } catch (err) {
      set({ error: err.message })
    }
  },

  createProduct: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await productAPI.create(data)
      set((state) => ({
        products: [...state.products, response.data.data],
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await productAPI.update(id, data)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? response.data.data : p)),
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      await productAPI.delete(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  // RECEIPTS
  fetchReceipts: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await receiptAPI.getAll(params)
      set({ receipts: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createReceipt: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await receiptAPI.create(data)
      set((state) => ({
        receipts: [...state.receipts, response.data.data],
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  updateReceiptStatus: async (id, status) => {
    set({ loading: true })
    try {
      const response = await receiptAPI.updateStatus(id, status)
      set((state) => ({
        receipts: state.receipts.map((r) => (r.id === id ? response.data.data : r)),
        loading: false,
      }))
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  // DELIVERIES
  fetchDeliveries: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await deliveryAPI.getAll(params)
      set({ deliveries: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createDelivery: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await deliveryAPI.create(data)
      set((state) => ({
        deliveries: [...state.deliveries, response.data.data],
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  // TRANSFERS
  fetchTransfers: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await transferAPI.getAll(params)
      set({ transfers: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createTransfer: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await transferAPI.create(data)
      set((state) => ({
        transfers: [...state.transfers, response.data.data],
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  // ADJUSTMENTS
  fetchAdjustments: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await adjustmentAPI.getAll(params)
      set({ adjustments: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  createAdjustment: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await adjustmentAPI.create(data)
      set((state) => ({
        adjustments: [...state.adjustments, response.data.data],
        loading: false,
      }))
      return response.data.data
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  // WAREHOUSES
  fetchWarehouses: async () => {
    set({ loading: true, error: null })
    try {
      const response = await warehouseAPI.getAll()
      set({ warehouses: response.data.data || [], loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
