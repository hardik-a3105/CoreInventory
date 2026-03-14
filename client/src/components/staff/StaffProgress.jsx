import { useInventoryStore } from '../../store/inventoryStore'

export default function StaffProgress() {
  const { staffTasks } = useInventoryStore()
  const total = staffTasks.pickList.length + staffTasks.transfers.length + staffTasks.shelving.length + staffTasks.counting.length
  const done  = staffTasks.pickList.filter(p => p.status === 'done').length
  const pct   = Math.round((done / total) * 100)

  return (
    <div className="card px-6 py-5 flex items-center gap-8">
      <div className="flex-shrink-0">
        <div className="text-base font-bold text-navy">Today's Progress</div>
        <div className="text-sm text-muted mt-0.5">Keep going — you're doing great!</div>
      </div>

      <div className="flex gap-6">
        {[
          { num: total,        label: 'Total Tasks', color: 'text-navy' },
          { num: done,         label: 'Done',        color: 'text-green-700' },
          { num: total - done, label: 'Remaining',   color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.num}</div>
            <div className="text-xs text-muted font-medium uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted">{done} of {total} tasks done</span>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width:`${pct}%`, background:'linear-gradient(90deg, #6D28D9, #9F7AEA)' }}
          />
        </div>
      </div>

      <div className="font-cormorant text-4xl font-semibold text-primary flex-shrink-0">{pct}%</div>
    </div>
  )
}
