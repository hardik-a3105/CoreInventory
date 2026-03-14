import { useInventoryStore } from '../../store/inventoryStore'

export default function PickList() {
  const { staffTasks, togglePickItem } = useInventoryStore()
  const done = staffTasks.pickList.filter(p => p.status === 'done').length

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-navy">Pick List</h3>
          <p className="text-sm text-muted mt-0.5">Collect these items from shelves</p>
        </div>
        <span className="text-sm font-semibold text-primary bg-primary-light px-3 py-1 rounded-lg">
          {done} / {staffTasks.pickList.length} done
        </span>
      </div>
      {staffTasks.pickList.map((item) => {
        const isDone = item.status === 'done'
        return (
          <div key={item.id}
            className={`flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${isDone ? 'opacity-60' : ''}`}
            onClick={() => togglePickItem(item.id)}
          >
            {/* Checkbox */}
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${isDone ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'}`}>
              {isDone && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${isDone ? 'line-through text-muted' : 'text-navy'}`}>
                {item.name}
              </div>
              <div className="text-xs text-muted mt-0.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {item.location}
              </div>
            </div>

            <span className={`text-sm font-bold ${isDone ? 'text-muted' : 'text-navy'}`}>{item.qty}</span>

            {!isDone && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0
                ${item.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.urgent ? 'Urgent' : 'Pending'}
              </span>
            )}
            {isDone && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-100 text-green-700 flex-shrink-0">Done</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
