import { useInventoryStore } from '../../store/inventoryStore'

const CONFIG = [
  { key:'pickList',  icon:'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label:'Items to Pick',   desc:'Collect from shelves',    badge:'', bg:'#FFFBEB', color:'#D97706', iconBg:'#FEF3C7' },
  { key:'transfers', icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',                                                                                                     label:'Transfers',       desc:'Move between locations',  badge:'', bg:'#EFF6FF', color:'#2563EB', iconBg:'#DBEAFE' },
  { key:'shelving',  icon:'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',                                                                    label:'Items to Shelve', desc:'Put arrived goods away',  badge:"", bg:'#F0FDF4', color:'#059669', iconBg:'#DCFCE7' },
  { key:'counting',  icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',                    label:'Stock to Count',  desc:'Physical verification',  badge:'', bg:'#F5F3FF', color:'#6D28D9', iconBg:'#EDE9FF' },
]

export default function StaffTaskCards() {
  const { staffTasks } = useInventoryStore()
  return (
    <div className="grid grid-cols-4 gap-4">
      {CONFIG.map((c, i) => (
        <div key={c.key} className={`rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-shadow fade-up delay-${i+1}`}
          style={{ background: c.bg, borderColor: c.iconBg }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: c.iconBg }}>
            <svg className="w-6 h-6" style={{ color: c.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-1" style={{ color: c.color }}>
            {staffTasks[c.key]?.filter(t => t.status === 'PENDING').length || 0}
          </div>
          <div className="text-sm font-bold text-navy">{c.label}</div>
          <div className="text-xs text-muted mt-0.5">{c.desc}</div>
          {c.badge && (
            <div className="mt-3 text-xs font-semibold px-2 py-1 rounded-lg inline-block"
              style={{ background: c.iconBg, color: c.color }}>
              {c.badge}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
