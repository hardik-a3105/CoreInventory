import { useInventoryStore } from '../../store/inventoryStore'

export default function PickList() {
  const { operations, updateOperationStatus } = useInventoryStore()
  
  // Pick list consists of all PENDING operations
  const items = (operations || []).filter(op => op.status === 'PENDING' && (op.type === 'RECEIPT' || op.type === 'DELIVERY'))
  const doneCount = (operations || []).filter(op => op.status === 'COMPLETED').length

  const handleToggle = (id, currentStatus) => {
    const nextStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING'
    updateOperationStatus(id, nextStatus)
  }

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-navy">Fulfillment List</h3>
          <p className="text-sm text-muted mt-0.5">Validate receipts and deliveries</p>
        </div>
        <span className="text-sm font-semibold text-primary bg-primary-light px-3 py-1 rounded-lg">
          {items.length} tasks pending
        </span>
      </div>
      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-muted text-sm italic">No pending receipts or deliveries.</div>
      ) : (
        items.map((item) => {
          const isDone = item.status === 'COMPLETED'
          return (
            <div key={item.id}
              className={`flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${isDone ? 'opacity-60' : ''}`}
              onClick={() => handleToggle(item.id, item.status)}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isDone ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'}`}>
                {isDone && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${item.type === 'RECEIPT' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                    {item.type}
                  </span>
                  <div className={`text-sm font-semibold text-navy truncate`}>
                    {item.name}
                  </div>
                </div>
                <div className="text-xs text-muted mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {item.location}
                </div>
              </div>

              <span className={`text-sm font-bold text-navy`}>{item.qty}</span>
              
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 flex-shrink-0">Pending</span>
            </div>
          )
        })
      )}
    </div>
  )
}
