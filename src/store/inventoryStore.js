import { create } from 'zustand'
import { api } from '../lib/axios'

export const useInventoryStore = create((set) => ({
  kpis: {
    totalProducts: 0,
    lowStock: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    transfersToday: 0,
  },
  operations: [],
  stockHealth: [],
  warehouses: [],
  
  // These aren't connected to the dashboard endpoints yet, wait on these
  receipts: [],
  deliveries: [],
  transfers: [],
  adjustments: [],
  alerts: [],
  topProducts: [],
  staffTasks: { pickList: [], transfers: [], shelving: [], counting: [] },

  loading: false,
  error: null,

  fetchDashboardData: async (silent = false) => {
    if (!silent) set({ loading: true, error: null })
    try {
      const [kpisRes, opsRes, healthRes, warehouseRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/dashboard/operations'),
        api.get('/dashboard/stock-health'),
        api.get('/dashboard/warehouses')
      ])

      const operations = opsRes.data || [];
      const staffTasks = {
        pickList: operations.filter(op => (op.type === 'RECEIPT' || op.type === 'DELIVERY')),
        transfers: operations.filter(op => op.type === 'TRANSFER'),
        shelving: operations.filter(op => op.type === 'RECEIPT' && op.status === 'PENDING'),
        counting: []
      }

      set({
        kpis: kpisRes.data || {},
        operations: operations,
        staffTasks: staffTasks,
        stockHealth: healthRes.data || [],
        warehouses: warehouseRes.data || [],
        loading: false
      })
    } catch (err) {
      if (!silent) set({ error: err.message, loading: false })
    }
  },

  pollingInterval: null,

  startPolling: () => {
    // Refresh every 5 seconds silently
    const interval = setInterval(() => {
      useInventoryStore.getState().fetchDashboardData(true)
    }, 5000)
    set({ pollingInterval: interval })
  },

  stopPolling: () => {
    const { pollingInterval } = useInventoryStore.getState()
    if (pollingInterval) {
      clearInterval(pollingInterval)
      set({ pollingInterval: null })
    }
  },

  updateOperationStatus: async (id, status) => {
    try {
      await api.patch(`/operations/${id}/status`, { status })
      // Refresh data after update silently
      const { fetchDashboardData } = useInventoryStore.getState()
      await fetchDashboardData(true)
    } catch (err) {
      set({ error: err.response?.data?.error || err.message })
    }
  }
}))
