import { useState, useEffect } from 'react'
import { api } from '../../lib/axios'
import Badge from '../ui/Badge'

export default function TransfersTab({ onCreate }) {
  const [filter, setFilter] = useState('all')
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const { data } = await api.get('/operations?type=TRANSFER')
        setTransfers(data.operations || [])
      } catch (err) {
        console.error('Failed to fetch transfers', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransfers()
  }, [])

  const filtered = filter === 'all' ? transfers : transfers.filter(t => t.status.toLowerCase() === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Internal Transfers</h2>
          <p className="text-sm text-muted mt-1">Move stock between warehouses, floors, and racks. All movements are logged.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors"
        >
          + Create Transfer
        </button>
      </div>

      <div className="flex gap-2">
        {['all','transit','ready','draft'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors
              ${filter === f ? 'bg-primary text-white' : 'bg-white text-muted border border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
            {f === 'all' ? 'All Transfers' : f === 'transit' ? 'In Transit' : f === 'ready' ? 'Ready' : 'Draft'}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted self-center">{filtered.length} records</span>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>Transfer ID</span><span>From</span><span>To</span><span>Product</span><span>Qty</span><span>Status</span>
        </div>
        
        {loading ? (
          <div className="px-6 py-12 text-center text-muted text-sm">Loading transfers...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted text-sm">No transfers found.</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-[1fr_1.5fr_1.5fr_2fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer last:border-0 items-center">
              <span className="text-sm font-mono font-medium text-primary">TRN-{t.id.substring(0,6)}</span>
              <span className="text-sm font-medium text-navy">{t.warehouse?.name || 'Main'}</span>
              <span className="text-sm font-medium text-navy">{t.reference || 'Destination'}</span>
              <span className="text-sm text-navy">{t.product?.name}</span>
              <span className="text-sm font-semibold text-blue-700">{t.quantity} {t.unit}</span>
              <Badge status={t.status.toLowerCase()} />
            </div>
          ))
        )}
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-muted text-sm">No transfers found.</div>
        )}
      </div>
    </div>
  )
}
