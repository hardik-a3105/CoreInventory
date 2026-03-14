import { useState, useEffect } from 'react'
import Blobs from '../components/ui/Blobs'
import ManagerNav from '../components/layout/ManagerNav'
import OverviewTab from '../components/manager/OverviewTab'
import ProductsTab from '../components/manager/ProductsTab'
import ReceiptsTab from '../components/manager/ReceiptsTab'
import DeliveriesTab from '../components/manager/DeliveriesTab'
import TransfersTab from '../components/manager/TransfersTab'
import AdjustmentsTab from '../components/manager/AdjustmentsTab'
import UserManagement from '../components/admin/UserManagement'
import { useAuthStore } from '../store/authStore'
import { useInventoryStore } from '../store/inventoryStore'
import ProductModal from '../components/modals/ProductModal'
import OperationModal from '../components/modals/OperationModal'
import AdjustmentModal from '../components/modals/AdjustmentModal'

const TAB_CONTENT = {
  Dashboard:   <OverviewTab />,
  Products:    <ProductsTab />,
  Receipts:    <ReceiptsTab />,
  Deliveries:  <DeliveriesTab />,
  Transfers:   <TransfersTab />,
  Adjustments: <AdjustmentsTab />,
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [modal, setModal] = useState({ open: false, type: null, data: null })
  const { user } = useAuthStore()
  const { fetchDashboardData, startPolling, stopPolling, loading, error, kpis, operations } = useInventoryStore()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    fetchDashboardData()
    startPolling()
    return () => stopPolling()
  }, [])

  const hasData = kpis && (operations?.length > 0);

  if (loading && !hasData) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Failed to load data</h2>
          <p className="text-muted mb-6">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary w-full">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden">
      <Blobs />
      <div className="relative z-10">
        <ManagerNav 
          active={activeTab} 
          onTabChange={setActiveTab} 
          onNewOperation={() => setModal({ open: true, type: 'operation', data: 'RECEIPT' })}
        />

        <main className="px-6 py-6 max-w-[1400px] mx-auto">

          {/* Page header */}
          <div className="mb-6">
            <div className="font-cormorant text-3xl font-semibold text-navy leading-tight">
              {getGreeting()}, {firstName} —{' '}
              <em className="text-primary italic">here's your inventory</em>
            </div>
            <div className="text-sm text-muted mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              {' '}· Active Inventory · Just updated
            </div>
          </div>
          <div className="h-4" /> {/* Spacer */}

          {/* Tab content */}
          {/* Tab content */}
          <div key={activeTab} className="fade-up">
            {activeTab === 'Dashboard' && <OverviewTab onAction={(type) => setModal({ open: true, type })} />}
            {activeTab === 'Products' && <ProductsTab onAdd={() => setModal({ open: true, type: 'product' })} />}
            {activeTab === 'Receipts' && <ReceiptsTab onCreate={() => setModal({ open: true, type: 'operation', data: 'RECEIPT' })} />}
            {activeTab === 'Deliveries' && <DeliveriesTab onCreate={() => setModal({ open: true, type: 'operation', data: 'DELIVERY' })} />}
            {activeTab === 'Transfers' && <TransfersTab onCreate={() => setModal({ open: true, type: 'operation', data: 'TRANSFER' })} />}
            {activeTab === 'Adjustments' && <AdjustmentsTab onNew={() => setModal({ open: true, type: 'adjustment' })} />}
            {activeTab === 'Users' && isAdmin && <UserManagement />}
          </div>

          {/* Modals */}
          <ProductModal 
            isOpen={modal.open && modal.type === 'product'} 
            onClose={() => setModal({ open: false, type: null })}
            onSuccess={fetchDashboardData}
          />
          <OperationModal 
            isOpen={modal.open && modal.type === 'operation'} 
            initialType={modal.data || 'RECEIPT'}
            onClose={() => setModal({ open: false, type: null })}
            onSuccess={fetchDashboardData}
          />
          <AdjustmentModal 
            isOpen={modal.open && modal.type === 'adjustment'} 
            onClose={() => setModal({ open: false, type: null })}
            onSuccess={fetchDashboardData}
          />

        </main>
      </div>
    </div>
  )
}

