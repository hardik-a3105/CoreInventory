import { useState } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'
import Badge from '../ui/Badge'

export default function DeliveriesTab() {
  const { deliveries } = useInventoryStore()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? deliveries : deliveries.filter(d => d.status === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Outgoing Stock — Deliveries</h2>
          <p className="text-sm text-muted mt-1">Pick, pack, and validate orders going out to customers.</p>
        </div>
        <button className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors">
          + Create Delivery
        </button>
      </div>

      <div className="flex gap-2">
        {['all','ready','done','transit'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors
              ${filter === f ? 'bg-primary text-white' : 'bg-white text-muted border border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
            {f === 'all' ? 'All Deliveries' : f === 'ready' ? 'Ready to Ship' : f === 'done' ? 'Delivered' : 'In Transit'}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted self-center">{filtered.length} records</span>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>Delivery ID</span><span>Customer</span><span>Product</span><span>Quantity</span><span>Date</span><span>Status</span>
        </div>
        {filtered.map((d) => (
          <div key={d.id} className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-0 items-center">
            <span className="text-sm font-mono font-medium text-primary">{d.id}</span>
            <span className="text-sm font-medium text-navy">{d.customer}</span>
            <span className="text-sm text-navy">{d.product}</span>
            <span className="text-sm font-semibold text-red-600">{d.qty}</span>
            <span className="text-sm text-muted">{d.date}</span>
            <Badge status={d.status} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-muted text-sm">No deliveries found for this filter.</div>
        )}
      </div>
    </div>
  )
}
