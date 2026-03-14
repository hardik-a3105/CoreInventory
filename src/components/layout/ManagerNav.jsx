import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV = ['Dashboard','Products','Receipts','Deliveries','Transfers','Adjustments']

export default function ManagerNav({ active, onTabChange }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'JD'

  return (
    <nav className="glass-bg sticky top-0 z-50 flex items-center px-6 py-0 gap-0 h-16">
      {/* Logo */}
      <span className="logo text-2xl text-navy mr-8 flex-shrink-0">
        Core<em>Inventory</em>
      </span>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        {NAV.map((n) => (
          <button
            key={n}
            onClick={() => onTabChange?.(n)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer
              ${active === n
                ? 'bg-primary text-white'
                : 'bg-transparent text-muted hover:text-primary hover:bg-primary-light'
              }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center bg-gray-100 rounded-xl px-4 py-2 gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input placeholder="Search SKU, product..." className="bg-transparent outline-none text-sm text-navy w-44 placeholder:text-gray-400" />
        </div>

        <div className="relative cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">5</span>
        </div>

        <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl border-none cursor-pointer hover:bg-primary-dark transition-colors">
          + New Operation
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light border border-primary-mid flex items-center justify-center text-sm font-bold text-primary">
            {initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-navy leading-tight">{user?.name || 'Jay D.'}</div>
            <button onClick={() => { logout(); navigate('/login') }} className="text-xs text-muted hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-0">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
