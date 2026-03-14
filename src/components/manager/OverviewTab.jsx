import { useInventoryStore } from '../../store/inventoryStore'
import Badge from '../ui/Badge'

const KPI_CONFIG = [
  { key:'totalProducts',    label:'Total Products in Stock', sub:'Items currently available',   color:'#6D28D9', bg:'#EDE9FF', trend:'+24 this week' },
  { key:'lowStock',         label:'Need Restocking',         sub:'12 out of stock, 25 low',     color:'#DC2626', bg:'#FEF2F2', trend:'Action required' },
  { key:'pendingReceipts',  label:'Goods Arriving',          sub:'Waiting to be received',      color:'#D97706', bg:'#FFFBEB', trend:'3 need validation' },
  { key:'pendingDeliveries',label:'Orders to Ship',          sub:'Ready to dispatch today',     color:'#2563EB', bg:'#EFF6FF', trend:'6 due today' },
  { key:'transfersToday',   label:'Stock Moves Today',       sub:'Transfers between locations', color:'#059669', bg:'#ECFDF5', trend:'On track' },
]

const typeMap = {
  receipt:    { label:'Receipt',    dot:'#059669' },
  delivery:   { label:'Delivery',   dot:'#2563EB' },
  transfer:   { label:'Transfer',   dot:'#D97706' },
  adjustment: { label:'Adjustment', dot:'#6D28D9' },
}

export default function OverviewTab() {
  const { kpis, operations, warehouses, stockHealth } = useInventoryStore()

  return (
    <div className="flex flex-col gap-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {KPI_CONFIG.map((c, i) => (
          <div key={c.key} className={`card p-5 cursor-pointer hover:shadow-md transition-shadow fade-up delay-${i+1}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: c.bg, color: c.color }}>
                {c.trend}
              </span>
            </div>
            <div className="text-4xl font-bold mt-1" style={{ color: c.color }}>
              {kpis[c.key].toLocaleString()}
            </div>
            <div className="text-sm font-semibold text-navy mt-1">{c.label}</div>
            <div className="text-xs text-muted mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns: Recent + Health */}
      <div className="grid grid-cols-3 gap-5">

        {/* Recent Operations */}
        <div className="col-span-2 card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="section-title">Recent Operations</h3>
            <button className="text-sm font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer">See all</button>
          </div>
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-6 py-3 bg-gray-50 text-xs font-semibold text-muted uppercase tracking-wide">
            <span>Document / Product</span><span>Type</span><span>Qty</span><span>Location</span><span>Status</span>
          </div>
          {operations.slice(0,6).map((op) => {
            const t = typeMap[op.type]
            return (
              <div key={op.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer last:border-0 items-center">
                <div>
                  <div className="text-sm font-semibold text-navy">{op.name}</div>
                  <div className="text-xs text-muted mt-0.5">{op.from} · {op.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.dot }} />
                  <span className="text-sm text-muted">{t.label}</span>
                </div>
                <span className={`text-sm font-semibold ${op.qty.startsWith('+') ? 'text-green-700' : op.qty.startsWith('−') ? 'text-red-600' : 'text-blue-700'}`}>
                  {op.qty}
                </span>
                <span className="text-sm text-muted">{op.location}</span>
                <Badge status={op.status} />
              </div>
            )
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Stock Health */}
          <div className="card p-5 flex-1">
            <h3 className="section-title mb-4">Stock Health</h3>
            {stockHealth.map((s) => (
              <div key={s.label} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-navy">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width:`${Math.max(s.pct,1)}%`, background: s.color }} />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm font-semibold text-green-700">
              Overall: 83% Healthy
            </div>
          </div>

          {/* Warehouse */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Warehouse Capacity</h3>
            {warehouses.map((w) => (
              <div key={w.id} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-navy">{w.name}</span>
                  <span className="text-sm font-bold" style={{ color: w.color }}>{w.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${w.pct}%`, background: w.color }} />
                </div>
                <div className="text-xs text-muted mt-1">{w.status}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
