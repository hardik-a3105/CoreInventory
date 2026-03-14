const ACTIVITY = [
  { id:1, action:'Completed picking', target:'Steel Rods 12mm', detail:'50 kg from Rack A3', time:'09:42 AM', color:'#059669' },
  { id:2, action:'Shelved',           target:'Aluminum Sheets',  detail:'into Rack B1',       time:'09:10 AM', color:'#059669' },
  { id:3, action:'Validated receipt', target:'REC-0089',         detail:'Steel Rods arrived', time:'08:58 AM', color:'#059669' },
  { id:4, action:'Reported damage',   target:'3 PVC Pipes',      detail:'in Rack B4',         time:'08:22 AM', color:'#D97706' },
  { id:5, action:'Shift started',     target:'Morning shift',    detail:'WH-1',               time:'08:00 AM', color:'#6D28D9' },
]

const TEAM = [
  { initials:'RS', name:'Ravi S.',  role:'Picking & Transfers',   you:true,  online:true,  bg:'#EDE9FF', color:'#6D28D9' },
  { initials:'PM', name:'Priya M.', role:'Shelving & Counting',   you:false, online:true,  bg:'#DCFCE7', color:'#059669' },
  { initials:'AK', name:'Ankit K.', role:'Receiving & Transfers', you:false, online:true,  bg:'#FEF3C7', color:'#D97706' },
  { initials:'SK', name:'Suresh K.',role:'Stock Counting',        you:false, online:false, bg:'#EFF6FF', color:'#2563EB' },
]

export function MyActivity() {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-navy">My Activity Today</h3>
        <p className="text-sm text-muted mt-0.5">Your completed actions this shift</p>
      </div>
      {ACTIVITY.map((a, i) => (
        <div key={a.id} className="flex items-start gap-4 px-6 py-4 border-b border-gray-50 last:border-0 relative">
          {i < ACTIVITY.length - 1 && (
            <div className="absolute left-[30px] top-10 bottom-0 w-px bg-gray-100" />
          )}
          <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 z-10 ring-2 ring-white" style={{ background: a.color }} />
          <div className="flex-1">
            <div className="text-sm text-navy">
              {a.action}{' '}
              <span className="font-semibold text-primary">{a.target}</span>
              {' '}— {a.detail}
            </div>
            <div className="text-xs text-muted mt-0.5">{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TeamOnShift() {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-navy">Team on Shift</h3>
        <p className="text-sm text-muted mt-0.5">WH-1 · Morning shift</p>
      </div>
      <div className="px-6 py-4 flex flex-col gap-4">
        {TEAM.map((m) => (
          <div key={m.initials} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: m.bg, color: m.color }}>
              {m.initials}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-navy">
                {m.name}
                {m.you && <span className="text-xs font-normal text-muted ml-1">(You)</span>}
              </div>
              <div className="text-xs text-muted">{m.role}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: m.online ? '#059669' : '#D97706' }} />
              <span className="text-xs text-muted">{m.online ? 'Online' : 'Away'}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="text-sm font-semibold text-primary">Need help? Message your manager</div>
        <div className="text-xs text-muted mt-0.5">Jay D. is online · Inventory Manager</div>
      </div>
    </div>
  )
}
