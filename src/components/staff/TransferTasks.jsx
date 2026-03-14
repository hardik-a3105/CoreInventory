import { useInventoryStore } from '../../store/inventoryStore'

export default function TransferTasks() {
  const { staffTasks } = useInventoryStore()
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-navy">Transfers to Do</h3>
        <p className="text-sm text-muted mt-0.5">Move stock between these locations today</p>
      </div>
      {staffTasks.transfers.map((t) => (
        <div key={t.id} className="flex items-center gap-4 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-navy">{t.item}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">{t.from}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-lg">{t.to}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-blue-700">{t.qty}</div>
            <div className="text-xs text-muted mt-0.5">{t.time}</div>
          </div>
          <button className="text-xs font-semibold bg-primary text-white px-3 py-2 rounded-lg border-none cursor-pointer hover:bg-primary-dark transition-colors">
            Start
          </button>
        </div>
      ))}
      {/* Scan hint */}
      <div className="mx-5 my-4 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer">
        <svg className="w-7 h-7 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H2a2 2 0 00-2 2v10a2 2 0 002 2h3m10-16h3a2 2 0 012 2v3M3 3l18 18" />
        </svg>
        <div className="text-sm font-semibold text-gray-500">Scan barcode to start transfer</div>
        <div className="text-xs text-gray-400 mt-1">Point camera at item barcode or QR code</div>
      </div>
    </div>
  )
}
