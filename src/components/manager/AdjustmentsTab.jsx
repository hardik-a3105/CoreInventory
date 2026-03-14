import { useState } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'
import Badge from '../ui/Badge'

export default function AdjustmentsTab() {
  const { adjustments, alerts } = useInventoryStore()
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? adjustments : adjustments.filter(a => a.status === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Stock Adjustments</h2>
          <p className="text-sm text-muted mt-1">Fix mismatches between system records and physical counts.</p>
        </div>
        <button className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors">
          + New Adjustment
        </button>
      </div>

      {/* Alert summary */}
      <div className="card p-5 border-l-4 border-red-400">
        <div className="text-sm font-bold text-red-700 mb-3">Items requiring attention ({alerts.length})</div>
        <div className="grid grid-cols-2 gap-3">
          {alerts.map((a) => (
            <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl ${a.severity === 'critical' ? 'bg-red-50' : 'bg-amber-50'}`}>
              <div>
                <div className="text-sm font-semibold text-navy">{a.name}</div>
                <div className={`text-xs mt-0.5 ${a.severity === 'critical' ? 'text-red-600' : 'text-amber-700'}`}>
                  Have: {a.have}{a.need !== '—' ? ` — Minimum: ${a.need}` : ' — Out of stock'}
                </div>
              </div>
              <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer
                ${a.severity === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'} transition-colors`}>
                {a.severity === 'critical' ? 'Order Now' : 'Reorder'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {['all','done','draft'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors
              ${filter === f ? 'bg-primary text-white' : 'bg-white text-muted border border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
            {f === 'all' ? 'All' : f === 'done' ? 'Validated' : 'Draft'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>ID</span><span>Product</span><span>Location</span><span>Reason</span><span>Qty Change</span><span>Status</span>
        </div>
        {filtered.map((a) => (
          <div key={a.id} className="grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer last:border-0 items-center">
            <span className="text-sm font-mono font-medium text-primary">{a.id}</span>
            <span className="text-sm font-medium text-navy">{a.product}</span>
            <span className="text-sm text-muted">{a.location}</span>
            <span className="text-sm text-navy">{a.reason}</span>
            <span className={`text-sm font-semibold ${a.qty.startsWith('+') ? 'text-green-700' : 'text-red-600'}`}>{a.qty}</span>
            <Badge status={a.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
