import { useState } from 'react'
import Blobs from '../components/ui/Blobs'
import ManagerNav from '../components/layout/ManagerNav'
import OverviewTab from '../components/manager/OverviewTab'
import ProductsTab from '../components/manager/ProductsTab'
import ReceiptsTab from '../components/manager/ReceiptsTab'
import DeliveriesTab from '../components/manager/DeliveriesTab'
import TransfersTab from '../components/manager/TransfersTab'
import AdjustmentsTab from '../components/manager/AdjustmentsTab'
import { useAuthStore } from '../store/authStore'

const TABS = ['Dashboard', 'Products', 'Receipts', 'Deliveries', 'Transfers', 'Adjustments']

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
  const { user } = useAuthStore()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden">
      <Blobs />
      <div className="relative z-10">
        <ManagerNav active={activeTab} onTabChange={setActiveTab} />

        <main className="px-6 py-6 max-w-[1400px] mx-auto">

          {/* Page header */}
          <div className="mb-6">
            <div className="font-cormorant text-3xl font-semibold text-navy leading-tight">
              {getGreeting()}, {firstName} —{' '}
              <em className="text-primary italic">here's your inventory</em>
            </div>
            <div className="text-sm text-muted mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              {' '}· 3 warehouses active · Last updated 2 min ago
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold border-none cursor-pointer transition-all rounded-t-xl -mb-px
                  ${activeTab === tab
                    ? 'bg-white text-primary border border-gray-200 border-b-white'
                    : 'bg-transparent text-muted hover:text-navy hover:bg-white/60'
                  }`}
                style={activeTab === tab ? { borderBottom: '2px solid #6D28D9' } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={activeTab} className="fade-up">
            {TAB_CONTENT[activeTab]}
          </div>

        </main>
      </div>
    </div>
  )
}

