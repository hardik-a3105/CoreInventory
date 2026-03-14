import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { api } from '../../lib/axios'

export default function AdjustmentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    reason: 'STOCK_COUNT',
    notes: ''
  })
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [pRes, wRes] = await Promise.all([
            api.get('/products?limit=100'),
            api.get('/dashboard/warehouses')
          ])
          setProducts(pRes.data.products || [])
          setWarehouses(wRes.data || [])
        } catch (err) {
          console.error('Failed to fetch modal data', err)
        } finally {
          setFetching(false)
        }
      }
      fetchData()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/adjustments', form)
      onSuccess()
      onClose()
      setForm({
        productId: '',
        warehouseId: '',
        quantity: 0,
        reason: 'STOCK_COUNT',
        notes: ''
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create adjustment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Stock Adjustment">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Product</label>
            <select 
              required
              className="inp w-full"
              value={form.productId}
              onChange={e => setForm({...form, productId: e.target.value})}
              disabled={fetching}
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Warehouse</label>
            <select 
              required
              className="inp w-full"
              value={form.warehouseId}
              onChange={e => setForm({...form, warehouseId: e.target.value})}
              disabled={fetching}
            >
              <option value="">Select warehouse...</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">
              Qty Adjustment (+/-)
            </label>
            <input 
              required
              type="number"
              className="inp w-full"
              placeholder="e.g. -5 or 10"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 0})}
            />
            <p className="text-[10px] text-muted mt-1 italic">Use negative for stock out/damage, positive for stock in/found.</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Reason</label>
            <select 
              required
              className="inp w-full"
              value={form.reason}
              onChange={e => setForm({...form, reason: e.target.value})}
            >
              <option value="STOCK_COUNT">Stock Count / Audit</option>
              <option value="DAMAGE">Damage / Breakage</option>
              <option value="EXPIRY">Product Expiry</option>
              <option value="WRITE_OFF">Lost / Write-off</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Adjustment Notes</label>
          <textarea 
            className="inp w-full min-h-[60px] py-3"
            placeholder="Why is this adjustment necessary?"
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-navy font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || fetching}
            className="flex-[2] btn-primary disabled:opacity-60"
          >
            {loading ? 'Adjusting...' : 'Perform Adjustment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
