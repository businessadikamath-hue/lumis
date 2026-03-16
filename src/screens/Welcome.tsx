import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useState(() => {
    if (!localStorage.getItem('lumis_device_id')) {
      localStorage.setItem('lumis_device_id', Math.random().toString(36).substring(2, 15));
    }
  });

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Returning users with correct password skip verification
    localStorage.setItem('lumis_device_trusted', 'true');
    navigate('/home');
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, device_id: localStorage.getItem('lumis_device_id') }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    localStorage.setItem('lumis_pending_email', email);
    localStorage.setItem('lumis_verify_reason', 'new_signup');
    localStorage.setItem('lumis_name', firstName);
    navigate('/verify');
  };

  return (
    <div className="screen" style={{ overflow: 'hidden', position: 'relative' }}>
      <div className="ambient-bg" style={{ zIndex: 0 }} />
      
      <div style={{ height: '35vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <h1 className="t-display" style={{ fontStyle: 'italic', fontSize: '40px', color: 'white' }}>Lumis</h1>
        <p className="t-caption" style={{ color: 'rgba(255,255,255,0.6)' }}>your mind, understood.</p>
      </div>

      <div 
        className="glass-modal"
        style={{ 
          height: '65vh', 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          position: 'relative', 
          zIndex: 2,
          background: 'rgba(18, 20, 40, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '4px', position: 'relative' }}>
          <button 
            onClick={() => setMode('login')}
            style={{ flex: 1, padding: '12px', borderRadius: '100px', border: 'none', background: mode === 'login' ? 'rgba(255,255,255,0.1)' : 'transparent', color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 600, zIndex: 1, cursor: 'pointer', transition: 'all 0.3s' }}
          >
            Log In
          </button>
          <button 
            onClick={() => setMode('signup')}
            style={{ flex: 1, padding: '12px', borderRadius: '100px', border: 'none', background: mode === 'signup' ? 'rgba(255,255,255,0.1)' : 'transparent', color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 600, zIndex: 1, cursor: 'pointer', transition: 'all 0.3s' }}
          >
            Sign Up
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {mode === 'signup' && (
            <input 
              type="text" className="glass-input" placeholder="First name"
              value={firstName} onChange={e => setFirstName(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
            />
          )}
          
          <input 
            type="email" className="glass-input" placeholder="Email address"
            value={email} onChange={e => setEmail(e.target.value.toLowerCase())}
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
          />
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} className="glass-input" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: '48px', background: 'rgba(255,255,255,0.08)', color: 'white' }}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {mode === 'signup' && (
            <input 
              type="password" className="glass-input" placeholder="Confirm password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
            />
          )}

          {error && (
            <div style={{ padding: '12px', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: '12px' }}>
              <p className="t-caption" style={{ color: '#ff4757', margin: 0, fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={mode === 'login' ? handleLogin : handleSignUp}
            disabled={loading}
            style={{ marginTop: '8px', height: '52px', background: 'var(--accent-violet)', borderRadius: '100px', border: 'none', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {loading ? <Loader2 className="spin" size={20} /> : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button 
              type="button"
              className="t-caption" 
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}