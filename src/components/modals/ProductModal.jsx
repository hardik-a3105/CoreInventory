import { useState } from 'react'
import Modal from '../ui/Modal'
import { api } from '../../lib/axios'

export default function ProductModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'pcs',
    minStock: 0,
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/products', form)
      onSuccess()
      onClose()
      setForm({ name: '', sku: '', category: '', unit: 'pcs', minStock: 0, description: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Product Name</label>
            <input 
              required
              className="inp w-full" 
              placeholder="e.g. Steel Rods 12mm"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">SKU</label>
            <input 
              required
              className="inp w-full" 
              placeholder="STL-012"
              value={form.sku}
              onChange={e => setForm({...form, sku: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Category</label>
            <input 
              className="inp w-full" 
              placeholder="Metals"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Unit</label>
            <select 
              className="inp w-full"
              value={form.unit}
              onChange={e => setForm({...form, unit: e.target.value})}
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="m">Meters (m)</option>
              <option value="l">Liters (l)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Min Stock</label>
            <input 
              type="number"
              className="inp w-full" 
              value={form.minStock}
              onChange={e => setForm({...form, minStock: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-widest mb-1.5 block">Description</label>
          <textarea 
            className="inp w-full min-h-[80px] py-3" 
            placeholder="Product details..."
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
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
            disabled={loading}
            className="flex-[2] btn-primary disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
