import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function StaffNav() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'RS'

  return (
    <nav className="glass-bg sticky top-0 z-50 flex items-center px-6 h-16 gap-4">
      <span className="logo text-2xl text-navy">Core<em>Inventory</em></span>
      <span className="bg-primary-light border border-primary-mid text-primary text-xs font-semibold px-3 py-1 rounded-lg">
        Warehouse Staff
      </span>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light border border-primary-mid flex items-center justify-center text-sm font-bold text-primary">
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-navy leading-tight">{user?.name || 'Ravi S.'}</div>
            <div className="text-xs text-muted">WH-1 · Morning Shift</div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }} className="text-xs text-muted hover:text-red-500 bg-transparent border-none cursor-pointer ml-1">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
