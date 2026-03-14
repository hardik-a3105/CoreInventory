import { useState, useEffect } from 'react'
import Blobs from '../components/ui/Blobs'
import StaffNav from '../components/layout/StaffNav'
import StaffProgress from '../components/staff/StaffProgress'
import StaffTaskCards from '../components/staff/StaffTaskCards'
import PickList from '../components/staff/PickList'
import TransferTasks from '../components/staff/TransferTasks'
import { ShelvingPanel, CountingPanel } from '../components/staff/ShelvingCounting'
import { MyActivity, TeamOnShift } from '../components/staff/ActivityTeam'
import { useAuthStore } from '../store/authStore'
import { useInventoryStore } from '../store/inventoryStore'

const TABS = ['All Tasks', 'Pick List', 'Transfers', 'Shelving', 'Stock Count', 'My Activity']

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('All Tasks')
  const { user } = useAuthStore()
  const { fetchDashboardData, startPolling, stopPolling, loading, error } = useInventoryStore()
  const firstName = user?.name?.split(' ')[0] || 'there'

  useEffect(() => {
    fetchDashboardData()
    startPolling()
    return () => stopPolling()
  }, [])

  // Check if we already have some data (e.g. from state)
  const hasData = fetchDashboardData && (TABS.length > 0); // Simplified check, better would be actual data presence

  // Actually, better to check operations or similar from store
  const { operations } = useInventoryStore()
  const dataPresent = operations?.length > 0;

  if (loading && !dataPresent) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy font-semibold">Loading shift data...</p>
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

  const renderTab = () => {
    switch (activeTab) {
      case 'All Tasks': return (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-5">
            <PickList />
            <TransferTasks />
            <div className="flex flex-col gap-5">
              <ShelvingPanel />
              <CountingPanel />
            </div>
          </div>
        </div>
      )
      case 'Pick List':   return <PickList />
      case 'Transfers':   return <TransferTasks />
      case 'Shelving':    return <ShelvingPanel />
      case 'Stock Count': return <CountingPanel />
      case 'My Activity': return (
        <div className="grid grid-cols-2 gap-5">
          <MyActivity />
          <TeamOnShift />
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden">
      <Blobs />
      <div className="relative z-10">
        <StaffNav />

        <main className="px-6 py-6 max-w-[1400px] mx-auto">

          {/* Greeting */}
          <div className="mb-6">
            <div className="font-cormorant text-3xl font-semibold text-navy">
              {getGreeting()}, {firstName} —{' '}
              <em className="text-primary italic">here's your work for today</em>
            </div>
            <div className="text-sm text-muted mt-1">
              {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              {' '}· Active Warehouse · Current Shift
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <StaffProgress />
          </div>

          {/* Task summary cards */}
          <div className="mb-5">
            <StaffTaskCards />
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold border-none cursor-pointer transition-all rounded-t-xl -mb-px
                  ${activeTab === tab
                    ? 'bg-white text-primary border border-gray-200'
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
            {renderTab()}
          </div>

        </main>
      </div>
    </div>
  )
}
