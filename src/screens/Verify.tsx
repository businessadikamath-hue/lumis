import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { pageVariants } from '../animations/variants';
import { Mail, Loader2 } from 'lucide-react';

export default function VerifyScreen() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const email = localStorage.getItem('lumis_pending_email');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6) verifyCode(code);
  }, [digits]);

  const verifyCode = async (code: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email: email!,
      token: code,
      type: 'email'
    });

    if (error) {
      setError("That code isn't right. Check your email and try again.");
      setDigits(['', '', '', '', '', '']);
      setLoading(false);
      return;
    }

    localStorage.setItem('lumis_device_trusted', 'true');
    const reason = localStorage.getItem('lumis_verify_reason');
    navigate(reason === 'new_signup' ? '/onboarding' : '/home', { replace: true });
  };

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '32px', textAlign: 'center' }}
    >
      <div className="ambient-bg" />
      
      <div style={{ marginTop: '80px', marginBottom: '40px' }}>
        <Mail size={64} color="var(--accent-violet)" />
        <h1 className="t-title" style={{ marginTop: '24px' }}>Check your inbox</h1>
        <p className="t-body" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          We sent a 6-digit code to <br/><strong>{email}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
        {digits.map((d, i) => (
          <input 
            key={i} id={`digit-${i}`}
            type="text" inputMode="numeric" maxLength={1}
            value={d} onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={loading}
            style={{ 
              width: '48px', height: '60px', borderRadius: '12px', background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', color: 'var(--accent-violet)', 
              fontSize: '28px', fontWeight: '700', textAlign: 'center', outline: 'none'
            }}
          />
        ))}
      </div>

      {loading && <Loader2 className="spin" size={24} style={{ marginBottom: '24px' }} />}
      
      {error && (
        <p className="t-caption" style={{ color: '#ff4757', marginBottom: '24px' }}>{error}</p>
      )}

      <button 
        disabled={countdown > 0}
        style={{ background: 'transparent', border: 'none', color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--accent-violet)', cursor: 'pointer', fontWeight: 600 }}
      >
        {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
      </button>
    </motion.div>
  );
}
