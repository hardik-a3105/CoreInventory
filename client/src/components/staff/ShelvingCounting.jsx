import { useInventoryStore } from '../../store/inventoryStore'

export function ShelvingPanel() {
  const { staffTasks } = useInventoryStore()
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-navy">Items to Shelve</h3>
        <p className="text-sm text-muted mt-0.5">Put these arrived goods away</p>
      </div>
      {staffTasks.shelving.map((s) => (
        <div key={s.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-navy">{s.name}</div>
            <div className="text-xs text-muted mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Put in: {s.location}
            </div>
          </div>
          <span className="text-sm font-bold text-green-700">{s.qty}</span>
          <button className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-2 rounded-lg border-none cursor-pointer hover:bg-green-200 transition-colors">
            Mark Done
          </button>
        </div>
      ))}
    </div>
  )
}

export function CountingPanel() {
  const { staffTasks } = useInventoryStore()
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-navy">Stock to Count</h3>
        <p className="text-sm text-muted mt-0.5">Verify physical quantities against system records</p>
      </div>
      {staffTasks.counting.map((c) => (
        <div key={c.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-navy">{c.name}</div>
            <div className="text-xs text-muted mt-0.5">{c.location} · System says: <span className="font-semibold text-navy">{c.systemQty}</span></div>
          </div>
          <button className="text-xs font-semibold bg-primary text-white px-3 py-2 rounded-lg border-none cursor-pointer hover:bg-primary-dark transition-colors">
            Start Count
          </button>
        </div>
      ))}
    </div>
  )
}
