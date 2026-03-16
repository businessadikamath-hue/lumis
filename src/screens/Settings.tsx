import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, LogOut, Bell, Cloud, Trash2, Mail, Palette, User, ShieldCheck, Loader2 } from 'lucide-react';
import { TabBar } from '../components/TabBar';
import { supabase } from '../lib/supabase';

const AVATARS = [
  'adventurer', 'avataaars', 'bottts', 'fun-emoji', 'micah', 'personas', 'pixel-art', 'thumbs',
  'lorelei', 'notionists', 'big-smile', 'croodles', 'identicon', 'rings', 'shapes'
];

const COLORS = [
  { name: 'Classic Violet', value: '#7c6bff' },
  { name: 'Ocean Blue', value: '#5ec4ff' },
  { name: 'Forest Green', value: '#4fd1a0' },
  { name: 'Warm Sunset', value: '#ff8c69' },
  { name: 'Royal Gold', value: '#ffcc00' }
];

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(user?.email || '');
  const [isSyncEnabled, setIsSyncEnabled] = useState(localStorage.getItem('lumis_cloud_sync') !== 'false');
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('lumis_avatar_style') || 'avataaars');
  const [selectedColor, setSelectedColor] = useState(localStorage.getItem('lumis_brand_color') || '#7c6bff');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-violet', selectedColor);
    localStorage.setItem('lumis_brand_color', selectedColor);
  }, [selectedColor]);

  const handleUpdateEmail = async () => {
    if (email === user?.email) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: "Check your new email to verify the change!", type: 'success' });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  const clearData = async () => {
    if (confirm("Are you sure? This will delete all entries locally. Cloud data remains unless deleted separately.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="screen" style={{ padding: '24px', paddingBottom: '120px' }}>
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', marginTop: '20px' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronLeft /></button>
        <h1 className="t-title">Settings</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Profile Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div 
              onClick={() => setShowAvatarPicker(true)}
              style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--accent-violet-20)', border: '2px solid var(--accent-violet)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
            >
              <img src={`https://api.dicebear.com/7.x/${selectedAvatar}/svg?seed=${user?.id}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
              <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '10px', textAlign: 'center', padding: '2px' }}>CHANGE</div>
            </div>
            <div>
              <h2 className="t-heading" style={{ fontSize: '18px' }}>{user?.user_metadata?.first_name || 'Lumis User'}</h2>
              <p className="t-caption" style={{ color: 'var(--text-tertiary)' }}>Set your visual identity</p>
            </div>
          </div>

          <AnimatePresence>
            {showAvatarPicker && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', marginBottom: '24px' }}
              >
                <div className="glass-card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {AVATARS.map(style => (
                    <button 
                      key={style}
                      onClick={() => { setSelectedAvatar(style); localStorage.setItem('lumis_avatar_style', style); setShowAvatarPicker(false); }}
                      style={{ padding: '4px', border: style === selectedAvatar ? '2px solid var(--accent-violet)' : '1px solid transparent', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    >
                      <img src={`https://api.dicebear.com/7.x/${style}/svg?seed=lumis`} alt={style} style={{ width: '100%', borderRadius: '8px' }} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Account Details */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Account</p>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <label className="t-caption" style={{ opacity: 0.5 }}>Email Address</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  className="glass-input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', height: '44px' }}
                />
                <button 
                  onClick={handleUpdateEmail}
                  disabled={loading || email === user?.email}
                  className="btn-primary" 
                  style={{ width: 'auto', padding: '0 16px', height: '44px', fontSize: '13px', opacity: email === user?.email ? 0.5 : 1 }}
                >
                  {loading ? <Loader2 size={16} className="spin" /> : 'Update'}
                </button>
              </div>
              {message && <p className="t-caption" style={{ color: message.type === 'error' ? '#ff4757' : '#4fd1a0', marginTop: '4px' }}>{message.text}</p>}
            </div>
            
            <button 
              onClick={handleSignOut}
              className="settings-row"
              style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer' }}
            >
              <span className="t-body">Sign Out</span>
              <LogOut size={18} />
            </button>
          </div>
        </section>

        {/* Customization */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Customization</p>
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Palette size={18} color="var(--accent-violet)" />
              <span className="t-body">Theme Color</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              {COLORS.map(c => (
                <button 
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  style={{ height: '32px', width: '32px', borderRadius: '50%', background: c.value, border: selectedColor === c.value ? '3px solid white' : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Data & Security */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Privacy & Data</p>
          <div className="glass-card">
            
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Cloud size={18} color="var(--accent-violet)" />
                <div>
                  <p className="t-body" style={{ fontSize: '14px' }}>Cloud Backup</p>
                  <p className="t-caption" style={{ fontSize: '11px', opacity: 0.5 }}>Sync data across devices</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={isSyncEnabled} 
                onChange={e => {
                  const val = e.target.checked;
                  setIsSyncEnabled(val);
                  localStorage.setItem('lumis_cloud_sync', String(val));
                }}
                style={{ width: '40px', height: '20px', accentColor: 'var(--accent-violet)' }}
              />
            </div>

            <button 
              onClick={clearData}
              style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer' }}
            >
              <Trash2 size={18} />
              <span className="t-body">Clear Local Database</span>
            </button>
          </div>
        </section>

      </div>

      <TabBar />
    </div>
  );
}
