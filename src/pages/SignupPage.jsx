import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Blobs from '../components/ui/Blobs'

const ROLES = [
  {
    key: 'manager',
    title: 'Inventory Manager',
    sub: 'Full dashboard with KPIs, approvals & analytics',
    color: '#6D28D9',
    bg: '#EDE9FF',
    border: '#DDD5FF',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'staff',
    title: 'Warehouse Staff',
    sub: 'Daily tasks, pick lists & stock operations',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
]

export default function SignupPage() {
  const [form, setForm]     = useState({ name:'', email:'', password:'', confirm:'', role:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const handle = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (!form.role) { setError('Please select your role.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({ name: form.name, email: form.email, token: 'mock-token', role: form.role })
      navigate(form.role === 'manager' ? '/manager' : '/staff')
    }, 800)
  }

  const FIELDS = [
    { key:'name',    label:'Full Name',        type:'text',     ph:'Jay Doe'            },
    { key:'email',   label:'Email',            type:'email',    ph:'you@company.com'    },
    { key:'password',label:'Password',         type:'password', ph:'••••••••'           },
    { key:'confirm', label:'Confirm Password', type:'password', ph:'••••••••'           },
  ]

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <Blobs />
      <div className="relative z-10 w-full max-w-md px-4 fade-up">
        <div className="text-center mb-8">
          <span className="logo text-4xl text-navy">Core<em>Inventory</em></span>
          <p className="text-base text-muted mt-2">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-navy mb-6">Create account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handle} className="flex flex-col gap-5">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})} className="inp" />
              </div>
            ))}

            {/* Role selector */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-widest mb-3 block">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const selected = form.role === r.key
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setForm({...form, role: r.key})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                        selected ? 'shadow-md' : 'hover:shadow-sm'
                      }`}
                      style={{
                        borderColor: selected ? r.color : '#E5E7EB',
                        background: selected ? r.bg : '#FFFFFF',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: selected ? r.color : r.bg, color: selected ? '#FFFFFF' : r.color }}
                      >
                        {r.icon}
                      </div>
                      <span className="text-sm font-bold" style={{ color: selected ? r.color : '#1E1B4B' }}>
                        {r.title}
                      </span>
                      <span className="text-xs text-center leading-snug" style={{ color: selected ? r.color : '#6B7280' }}>
                        {r.sub}
                      </span>
                      {selected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mt-1" style={{ background: r.color }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 mt-1">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
