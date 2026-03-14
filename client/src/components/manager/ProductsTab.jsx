import { useState, useEffect } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'
import Badge from '../ui/Badge'

export default function ProductsTab() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { products, categories, fetchProducts, fetchCategories, loading } = useInventoryStore()

  useEffect(() => {
    fetchProducts({ search, category: category !== 'all' ? category : undefined })
    fetchCategories()
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || p.category?.name === category
    return matchSearch && matchCat
  })

  const categoryList = ['all', ...new Set(categories.map(c => c.name))]

  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
    if (currentStock < minimumStock) return { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'In Stock', cls: 'bg-green-100 text-green-700' }
  }

  if (loading && products.length === 0) {
    return <div className="p-6 text-center text-muted">Loading products...</div>
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
          {categoryList.map(c => (
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
          const ss = getStockStatus(p.currentStock || 0, p.minimumStock || 0)
          return (
            <div key={p.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-0 items-center">
              <span className="text-sm font-mono font-medium text-primary">{p.sku}</span>
              <span className="text-sm font-semibold text-navy">{p.name}</span>
              <span className="text-sm text-muted">{p.category?.name || '−'}</span>
              <span className="text-sm text-muted">{p.unit || '−'}</span>
              <div>
                <span className={`text-sm font-bold ${(p.currentStock || 0) === 0 ? 'text-red-600' : (p.currentStock || 0) < (p.minimumStock || 0) ? 'text-amber-600' : 'text-green-700'}`}>
                  {p.currentStock || 0} {p.unit || 'pcs'}
                </span>
                <div className="text-xs text-muted">Min: {p.minimumStock || 0}</div>
              </div>
              <span className="text-sm text-muted">{p.warehouse?.name || '−'}</span>
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
