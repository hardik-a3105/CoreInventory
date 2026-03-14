import { useState, useEffect } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'
import Badge from '../ui/Badge'

export default function AdjustmentsTab() {
  const { adjustments, fetchAdjustments, loading } = useInventoryStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const filtered = filter === 'all' ? adjustments : adjustments.filter(a => a.status === filter)

  if (loading && adjustments.length === 0) {
    return <div className="p-6 text-center text-muted">Loading adjustments...</div>
  }

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

      {adjustments && adjustments.length > 0 && (
        <div className="card p-5 border-l-4 border-amber-400 bg-amber-50">
          <div className="text-sm font-bold text-amber-700">Recent Adjustments</div>
          <div className="text-xs text-amber-600 mt-1">Total adjustments in system: {adjustments.length}</div>
        </div>
      )}

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
        {filtered.map((a) => {
          const qtyNum = a.quantityDifference || 0
          const qtyStr = qtyNum >= 0 ? `+${qtyNum}` : `${qtyNum}`
          return (
            <div key={a.id} className="grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer last:border-0 items-center">
              <span className="text-sm font-mono font-medium text-primary">{a.adjustmentNumber || a.id}</span>
              <span className="text-sm font-medium text-navy">{a.product?.name || a.productName || '−'}</span>
              <span className="text-sm text-muted">{a.warehouse?.name || a.location || '−'}</span>
              <span className="text-sm text-navy">{a.reason || '−'}</span>
              <span className={`text-sm font-semibold ${qtyNum >= 0 ? 'text-green-700' : 'text-red-600'}`}>{qtyStr}</span>
              <Badge status={a.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
