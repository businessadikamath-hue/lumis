import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { sendDeviceVerificationCode } from '../utils/auth';
import { bottomSheet } from '../animations/variants';
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

    const isTrusted = localStorage.getItem('lumis_device_trusted');

    if (!isTrusted) {
      await sendDeviceVerificationCode(email);
      localStorage.setItem('lumis_pending_email', email);
      localStorage.setItem('lumis_verify_reason', 'new_device');
      navigate('/verify');
    } else {
      navigate('/home');
    }
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
    <div className="screen">
      <div className="ambient-bg" />
      
      <div style={{ height: '35vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="t-display" style={{ fontStyle: 'italic', fontSize: '40px' }}>Lumis</h1>
        <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>your mind, understood.</p>
      </div>

      <motion.div 
        className="glass-modal"
        variants={bottomSheet}
        initial="closed"
        animate="open"
        style={{ height: '65vh', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '4px', position: 'relative' }}>
          <button 
            onClick={() => setMode('login')}
            style={{ flex: 1, padding: '10px', borderRadius: '100px', border: 'none', background: 'transparent', color: mode === 'login' ? 'white' : 'var(--text-tertiary)', fontWeight: 600, zIndex: 1, cursor: 'pointer' }}
          >
            Log In
          </button>
          <button 
            onClick={() => setMode('signup')}
            style={{ flex: 1, padding: '10px', borderRadius: '100px', border: 'none', background: 'transparent', color: mode === 'signup' ? 'white' : 'var(--text-tertiary)', fontWeight: 600, zIndex: 1, cursor: 'pointer' }}
          >
            Sign Up
          </button>
          <motion.div 
            layoutId="tab-pill"
            style={{ position: 'absolute', inset: '4px', width: '50%', background: 'var(--glass-bg-active)', borderRadius: '100px', left: mode === 'login' ? '4px' : '50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {mode === 'signup' && (
            <input 
              type="text" className="glass-input" placeholder="First name"
              value={firstName} onChange={e => setFirstName(e.target.value)}
            />
          )}
          
          <input 
            type="email" className="glass-input" placeholder="Email address"
            value={email} onChange={e => setEmail(e.target.value.toLowerCase())}
          />
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} className="glass-input" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: '48px' }}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {mode === 'signup' && (
            <input 
              type="password" className="glass-input" placeholder="Confirm password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            />
          )}

          {error && (
            <div style={{ padding: '12px', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: '12px' }}>
              <p className="t-caption" style={{ color: '#ff4757', margin: 0 }}>{error}</p>
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
              className="t-caption" 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}