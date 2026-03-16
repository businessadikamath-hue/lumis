import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Loader2 } from 'lucide-react';

export default function VerifyScreen() {
  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
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

    if (val && index < 7) {
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 8);
    if (!/^\d+$/.test(pasteData)) return;
    
    const newDigits = [...digits];
    pasteData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    
    // Focus the next available slot
    const lastIndex = Math.min(pasteData.length, 7);
    document.getElementById(`digit-${lastIndex}`)?.focus();
  };

  useEffect(() => {
    const code = digits.join('');
    if (code.length === 8) verifyCode(code);
  }, [digits]);

  const verifyCode = async (code: string) => {
    setLoading(true);
    setError(null);

    const reason = localStorage.getItem('lumis_verify_reason');
    const { error } = await supabase.auth.verifyOtp({
      email: email!,
      token: code,
      type: reason === 'new_signup' ? 'signup' : 'email'
    });

    if (error) {
      setError("That code isn't right. Check your email and try again.");
      setDigits(['', '', '', '', '', '', '', '']);
      setLoading(false);
      return;
    }

    localStorage.setItem('lumis_device_trusted', 'true');
    navigate(reason === 'new_signup' ? '/onboarding' : '/home', { replace: true });
  };

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setCountdown(60);
    setError(null);
    
    try {
      const reason = localStorage.getItem('lumis_verify_reason');
      if (reason === 'new_signup') {
        // For signup, we just notify them to try after some time or check spam
        // Re-sending a signup OTP usually requires re-calling signUp or using a dedicated resend endpoint if available
        setError("Please check your spam folder. If you don't see it, try signing up again in a few minutes.");
      } else {
        const { sendDeviceVerificationCode } = await import('../utils/auth');
        await sendDeviceVerificationCode(email);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="screen"
      style={{ padding: '24px', textAlign: 'center', position: 'relative', zIndex: 10, color: 'white' }}
    >
      <div className="ambient-bg" />
      
      <div style={{ marginTop: '80px', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <Mail size={56} color="#7c6bff" style={{ margin: '0 auto' }} />
        <h1 className="t-title" style={{ marginTop: '24px', color: 'white', fontSize: '24px' }}>Check your inbox</h1>
        <p className="t-body" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '12px', fontSize: '15px' }}>
          We sent an 8-digit code to <br/>
          <strong style={{ color: 'white' }}>{email || 'your email'}</strong>
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '6px', 
        width: '100%', 
        maxWidth: '420px', 
        margin: '0 auto 32px', 
        position: 'relative', 
        zIndex: 2 
      }}>
        {digits.map((d, i) => (
          <input 
            key={i} id={`digit-${i}`}
            type="text" inputMode="numeric" maxLength={1}
            value={d} onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={loading}
            style={{ 
              flex: 1, 
              minWidth: '0',
              height: '52px', 
              borderRadius: '10px', 
              background: 'rgba(255,255,255,0.1)', 
              border: '2px solid rgba(255,255,255,0.2)', 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: '700', 
              textAlign: 'center', 
              outline: 'none'
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {loading && <Loader2 className="spin" size={24} style={{ marginBottom: '24px', margin: '0 auto' }} />}
        
        {error && (
          <p className="t-caption" style={{ color: '#ff4757', marginBottom: '24px', fontSize: '14px' }}>{error}</p>
        )}

        <button 
          onClick={handleResend}
          disabled={countdown > 0 || loading}
          style={{ 
            background: 'transparent', border: 'none', 
            color: countdown > 0 ? 'rgba(255,255,255,0.3)' : '#7c6bff', 
            cursor: 'pointer', fontWeight: 600, fontSize: '15px' 
          }}
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  );
}
