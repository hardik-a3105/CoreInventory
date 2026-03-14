import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Blobs from '../components/ui/Blobs'

export default function LoginPage() {
  const [form, setForm]     = useState({ email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    try {
      await login(form.email, form.password)
      navigate('/manager')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <Blobs />
      <div className="relative z-10 w-full max-w-md px-4 fade-up">
        <div className="text-center mb-8">
          <span className="logo text-4xl text-navy">Core<em>Inventory</em></span>
          <p className="text-base text-muted mt-2">Sign in to manage your inventory</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-navy mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handle} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">Email</label>
              <input type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} className="inp" />
            </div>
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} className="inp" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
