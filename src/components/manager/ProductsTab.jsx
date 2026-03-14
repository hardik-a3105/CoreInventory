import { useState } from 'react'
import Badge from '../ui/Badge'

const PRODUCTS = [
  { id:'SKU-0041', name:'Steel Rods 12mm',    category:'Metals',    unit:'kg',  stock:320,  min:50,  location:'Rack A3', status:'done'  },
  { id:'SKU-0089', name:'Copper Wire 2.5mm',  category:'Electrical',unit:'m',   stock:0,    min:100, location:'Rack C4', status:'draft' },
  { id:'SKU-0112', name:'Aluminum Sheets',    category:'Metals',    unit:'kg',  stock:180,  min:30,  location:'Rack B1', status:'done'  },
  { id:'SKU-0205', name:'Office Chairs',      category:'Furniture', unit:'pcs', stock:94,   min:10,  location:'Rack D2', status:'done'  },
  { id:'SKU-0318', name:'M8 Bolts',           category:'Hardware',  unit:'pcs', stock:120,  min:200, location:'Rack F3', status:'ready' },
  { id:'SKU-0402', name:'PVC Pipe 20mm',      category:'Plumbing',  unit:'pcs', stock:18,   min:40,  location:'Rack E1', status:'ready' },
  { id:'SKU-0500', name:'Steel Rod 8mm',      category:'Metals',    unit:'kg',  stock:3,    min:50,  location:'Rack A5', status:'draft' },
  { id:'SKU-0611', name:'Copper Cable 2.5mm', category:'Electrical',unit:'m',   stock:0,    min:80,  location:'Rack C5', status:'draft' },
]

export default function ProductsTab() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const categories = ['all', ...new Set(PRODUCTS.map(p => p.category))]
  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || p.category === category
    return matchSearch && matchCat
  })

  const getStockStatus = (stock, min) => {
    if (stock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
    if (stock < min) return { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'In Stock', cls: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Products</h2>
          <p className="text-sm text-muted mt-1">Manage your product catalog, stock levels, and reorder rules.</p>
        </div>
        <button className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors">
          + Add Product
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-navy outline-none focus:border-primary/50 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors capitalize
                ${category === c ? 'bg-primary text-white' : 'bg-white text-muted border border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
              {c === 'all' ? 'All Categories' : c}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-muted">{filtered.length} products</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
          <span>SKU</span><span>Product Name</span><span>Category</span><span>Unit</span><span>Current Stock</span><span>Location</span><span>Stock Status</span>
        </div>
        {filtered.map((p) => {
          const ss = getStockStatus(p.stock, p.min)
          return (
            <div key={p.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-0 items-center">
              <span className="text-sm font-mono font-medium text-primary">{p.id}</span>
              <span className="text-sm font-semibold text-navy">{p.name}</span>
              <span className="text-sm text-muted">{p.category}</span>
              <span className="text-sm text-muted">{p.unit}</span>
              <div>
                <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : p.stock < p.min ? 'text-amber-600' : 'text-green-700'}`}>
                  {p.stock} {p.unit}
                </span>
                <div className="text-xs text-muted">Min: {p.min}</div>
              </div>
              <span className="text-sm text-muted">{p.location}</span>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${ss.cls}`}>{ss.label}</span>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-muted text-sm">No products match your search.</div>
        )}
      </div>
    </div>
  )
}
