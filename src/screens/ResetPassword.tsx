// src/screens/ResetPassword.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [success, setSuccess]     = useState(false)
  const navigate = useNavigate()

  const handleReset = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords don\'t match.')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    // Mark this device as trusted since they just authenticated via email link
    localStorage.setItem('lumis_device_trusted', 'true')
    setTimeout(() => navigate('/home', { replace: true }), 1800)
  }

  if (success) return (
    <div className="screen screen-centered">
      <p style={{ fontSize: '40px' }}>✅</p>
      <p className="t-title">Password updated</p>
      <p className="t-body">Taking you back in…</p>
    </div>
  )

  return (
    <div className="screen">
      <div className="glass-modal">
        <h2 className="t-title">Set a new password</h2>
        <p className="t-body">Choose something secure that you haven't used before.</p>

        <input type="password" className="glass-input"
          placeholder="New password"
          value={password} onChange={e => setPassword(e.target.value)} />

        <input type="password" className="glass-input"
          placeholder="Confirm password"
          value={confirm} onChange={e => setConfirm(e.target.value)} />

        {error && <p className="error-msg">{error}</p>}

        <button className="btn-primary" onClick={handleReset} disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </div>
  )
}
// Style screen-centered: display flex, flex-direction column, align-items center,
// justify-content center, min-height 100vh, gap 16px, text-align center.