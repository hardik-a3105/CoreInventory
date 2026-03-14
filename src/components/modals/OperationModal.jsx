import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { api } from '../../lib/axios'

export default function OperationModal({ isOpen, onClose, onSuccess, initialType = 'RECEIPT' }) {
  const [form, setForm] = useState({
    type: initialType,
    productId: '',
    warehouseId: '',
    quantity: 1,
    reference: '',
    notes: ''
  })
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm(prev => ({ ...prev, type: initialType }))
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
  }, [isOpen, initialType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/operations', form)
      onSuccess()
      onClose()
      setForm({
        type: initialType,
        productId: '',
        warehouseId: '',
        quantity: 1,
        reference: '',
        notes: ''
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create operation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`New ${form.type.charAt(0) + form.type.slice(1).toLowerCase()}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Operation Type</label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['RECEIPT', 'DELIVERY', 'TRANSFER'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({...form, type: t})}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
                  ${form.type === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-navy'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

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
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">
              {form.type === 'TRANSFER' ? 'Source Warehouse' : 'Warehouse'}
            </label>
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
          {form.type === 'TRANSFER' && (
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Destination Warehouse</label>
              <select 
                required
                className="inp w-full"
                value={form.destinationWarehouseId || ''}
                onChange={e => setForm({...form, destinationWarehouseId: e.target.value})}
                disabled={fetching}
              >
                <option value="">Select destination...</option>
                {warehouses.filter(w => w.id !== form.warehouseId).map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className={form.type === 'TRANSFER' ? 'col-span-2' : ''}>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Quantity</label>
            <input 
              required
              type="number"
              min="1"
              className="inp w-full"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Reference (Optional)</label>
            <input 
              className="inp w-full"
              placeholder="PO, SO or Batch Number"
              value={form.reference}
              onChange={e => setForm({...form, reference: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Notes</label>
          <textarea 
            className="inp w-full min-h-[60px] py-3"
            placeholder="Additional information..."
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
            {loading ? 'Processing...' : 'Create Operation'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
