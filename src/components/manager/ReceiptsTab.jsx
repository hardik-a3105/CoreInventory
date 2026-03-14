import { useState, useEffect } from 'react'
import { api } from '../../lib/axios'
import Badge from '../ui/Badge'

export default function ReceiptsTab({ onCreate }) {
  const [filter, setFilter] = useState('all')
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const { data } = await api.get('/operations?type=RECEIPT')
        setReceipts(data.operations || [])
      } catch (err) {
        console.error('Failed to fetch receipts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReceipts()
  }, [])

  const filtered = filter === 'all' ? receipts : receipts.filter(r => r.status.toLowerCase() === filter)

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Incoming Goods — Receipts</h2>
          <p className="text-sm text-muted mt-1">Track all stock arriving from vendors. Validate to update inventory.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors"
        >
          + Create Receipt
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all','done','ready','transit','draft'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors capitalize
              ${filter === f ? 'bg-primary text-white' : 'bg-white text-muted border border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
            {f === 'all' ? 'All Receipts' : f === 'done' ? 'Validated' : f === 'ready' ? 'Ready' : f === 'transit' ? 'In Transit' : 'Draft'}
          </button>
        ))}
        <span className="ml-auto text-sm text-muted self-center">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>Receipt ID</span><span>Supplier/Ref</span><span>Product</span><span>Quantity</span><span>Date</span><span>Status</span>
        </div>
        
        {loading ? (
           <div className="px-6 py-12 text-center text-muted text-sm">Loading receipts...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted text-sm">No receipts found for this filter.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-0 items-center">
              <span className="text-sm font-mono font-medium text-primary">REC-{r.id.substring(0,6)}</span>
              <span className="text-sm font-medium text-navy">{r.reference || 'N/A'}</span>
              <span className="text-sm text-navy">{r.product?.name}</span>
              <span className="text-sm font-semibold text-green-700">+{r.quantity} {r.unit}</span>
              <span className="text-sm text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
              <Badge status={r.status.toLowerCase()} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
