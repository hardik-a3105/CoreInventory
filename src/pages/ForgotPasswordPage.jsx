import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Blobs from '../components/ui/Blobs'
import { api } from '../lib/axios'

const STEPS = [
  { title: 'Reset your password', sub: 'Enter the email linked to your account' },
  { title: 'Verify OTP',          sub: 'We sent a 6-digit code to your email' },
  { title: 'Set new password',    sub: 'Choose a strong new password' },
]

export default function ForgotPasswordPage() {
  const [step, setStep]         = useState(0) // 0 = email, 1 = otp, 2 = new password
  const [email, setEmail]       = useState('')
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const navigate = useNavigate()

  /* -------- Step 0: Send OTP -------- */
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Please enter your email address.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setStep(1)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  /* -------- Step 1: Verify OTP -------- */
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      prev?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return }
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { email, otp: code })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  /* -------- Step 2: Set New Password -------- */
  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (!password || !confirm) { setError('Please fill in both fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, otp: otp.join(''), password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  /* -------- Progress indicator -------- */
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[0, 1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              background: step >= s ? '#6D28D9' : '#E5E7EB',
              color: step >= s ? '#FFFFFF' : '#6B7280',
            }}
          >
            {step > s ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : s + 1}
          </div>
          {s < 2 && (
            <div
              className="w-10 h-0.5 rounded-full transition-all duration-300"
              style={{ background: step > s ? '#6D28D9' : '#E5E7EB' }}
            />
          )}
        </div>
      ))}
    </div>
  )

  /* -------- Success state -------- */
  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
        <Blobs />
        <div className="relative z-10 w-full max-w-md px-4 fade-up text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">Password Reset!</h2>
            <p className="text-sm text-muted mb-6">Your password has been updated successfully. You can now sign in with your new password.</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <Blobs />
      <div className="relative z-10 w-full max-w-md px-4 fade-up">
        <div className="text-center mb-8">
          <span className="logo text-4xl text-navy">Core<em>Inventory</em></span>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <StepIndicator />

          <h2 className="text-xl font-bold text-navy mb-1">{STEPS[step].title}</h2>
          <p className="text-sm text-muted mb-6">
            {step === 1 ? <>We sent a 6-digit code to <strong className="text-navy">{email}</strong></> : STEPS[step].sub}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* Step 0: Email */}
          {step === 0 && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inp"
                  autoFocus
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/, ''))}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-navy bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-primary focus:bg-white"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setOtp(['','','','','','']); setLoading(true); setTimeout(() => setLoading(false), 800) }}
                className="text-sm font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
              >
                Resend Code
              </button>
            </form>
          )}

          {/* Step 2: New Password */}
          {step === 2 && (
            <form onSubmit={handleReset} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inp"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-navy uppercase tracking-widest mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="inp"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted mt-6">
            <Link to="/login" className="text-primary font-semibold hover:underline">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
