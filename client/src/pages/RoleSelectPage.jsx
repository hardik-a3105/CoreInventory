import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Blobs from '../components/ui/Blobs'

const ROLES = [
  {
    key: 'MANAGER',
    title: 'Inventory Manager',
    subtitle: 'I manage stock operations',
    desc: 'View KPIs, approve receipts and deliveries, manage products, monitor all warehouses, and get full operational control.',
    features: ['Full dashboard with KPIs & analytics', 'Approve and manage all operations', 'Stock alerts and reorder rules', 'Multi-warehouse overview'],
    color: '#6D28D9',
    bg: '#EDE9FF',
    border: '#DDD5FF',
    btnBg: '#6D28D9',
    path: '/manager',
    icon: (
      <svg className="w-7 h-7" style={{ color:'#6D28D9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'STAFF',
    title: 'Warehouse Staff',
    subtitle: 'I work on the warehouse floor',
    desc: 'See your daily task list — items to pick, transfers to perform, shelving jobs, and stock counting assignments.',
    features: ['Daily pick list with exact locations', 'Transfer tasks with schedule', 'Shelving instructions', 'Stock count assignments'],
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    btnBg: '#059669',
    path: '/staff',
    icon: (
      <svg className="w-7 h-7" style={{ color:'#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
]

export default function RoleSelectPage() {
  const { user, setRole } = useAuthStore()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const select = (role, path) => {
    setRole(role)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <Blobs />
      <div className="relative z-10 w-full max-w-2xl px-4 fade-up">

        <div className="text-center mb-10">
          <span className="logo text-4xl text-navy">Core<em>Inventory</em></span>
          <h2 className="text-2xl font-bold text-navy mt-4">Welcome, {firstName}!</h2>
          <p className="text-base text-muted mt-1">Select your role to see your personalised dashboard</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {ROLES.map((r) => (
            <div key={r.key}
              className="bg-white rounded-2xl p-7 border-2 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              style={{ borderColor: r.border }}
              onClick={() => select(r.key, r.path)}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: r.bg }}>
                {r.icon}
              </div>

              <div className="text-xl font-bold text-navy">{r.title}</div>
              <div className="text-sm font-semibold mt-1" style={{ color: r.color }}>{r.subtitle}</div>
              <p className="text-sm text-muted mt-3 leading-relaxed">{r.desc}</p>

              <ul className="mt-4 flex flex-col gap-2">
                {r.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-navy">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: r.color }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="mt-6 w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: r.btnBg }}
              >
                Enter as {r.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
