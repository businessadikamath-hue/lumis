import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, LogOut, Cloud, Trash2, Palette, Mail, Loader2 } from 'lucide-react';
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
      setMessage({ text: "Verification link sent to new email!", type: 'success' });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  const clearData = async () => {
    if (confirm("Permanently delete local cache? Cloud data remains.")) {
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
        
        {/* Profile Card */}
        <section>
          <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--accent-violet-20)', border: '2px solid var(--accent-violet)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                >
                  <img src={`https://api.dicebear.com/7.x/${selectedAvatar}/svg?seed=${user?.id || 'lumis'}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '10px', textAlign: 'center', padding: '2px' }}>EDIT</div>
                </div>
                <div>
                   <h2 className="t-heading" style={{ fontSize: '18px' }}>{user?.user_metadata?.first_name || 'Lumis User'}</h2>
                   <p className="t-caption" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
                </div>
             </div>
          </div>
        </section>

        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="glass-card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {AVATARS.map(style => (
                  <button 
                    key={style}
                    onClick={() => { setSelectedAvatar(style); localStorage.setItem('lumis_avatar_style', style); setShowAvatarPicker(false); }}
                    style={{ padding: '4px', border: style === selectedAvatar ? '2px solid var(--accent-violet)' : '1px solid transparent', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  >
                    <img src={`https://api.dicebear.com/7.x/${style}/svg?seed=lumis`} alt={style} style={{ width: '100%' }} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email & Account */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px' }}>Account</p>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                   <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                   <input 
                      type="email" 
                      className="glass-input" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.03)', height: '44px' }}
                   />
                </div>
                <button 
                  onClick={handleUpdateEmail}
                  disabled={loading || email === user?.email}
                  className="btn-primary" 
                  style={{ width: 'auto', padding: '0 16px', height: '44px', fontSize: '12px', background: email === user?.email ? 'rgba(255,255,255,0.05)' : 'var(--accent-violet)' }}
                >
                  {loading ? <Loader2 size={16} className="spin" /> : 'Update'}
                </button>
             </div>
             {message && <p className="t-caption" style={{ color: message.type === 'error' ? '#ff4757' : '#4fd1a0' }}>{message.text}</p>}
          </div>
        </section>

        {/* Customization */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px' }}>Appearance</p>
          <div className="glass-card" style={{ padding: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Palette size={18} color="var(--accent-violet)" />
                <span className="t-body">Theme Accent</span>
             </div>
             <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                {COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    style={{ 
                      height: '36px', width: '36px', borderRadius: '12px', 
                      background: c.value, 
                      border: selectedColor === c.value ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer', transition: 'transform 0.2s'
                    }}
                  />
                ))}
             </div>
          </div>
        </section>

        {/* Data Sync */}
        <section>
          <p className="t-caption" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px' }}>Data & Privacy</p>
          <div className="glass-card">
             <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(94, 196, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5ec4ff' }}>
                      <Cloud size={16} />
                   </div>
                   <div>
                      <p className="t-body" style={{ fontSize: '14px' }}>Cloud Sync</p>
                      <p className="t-caption" style={{ fontSize: '11px', opacity: 0.5 }}>Backup entries automatically</p>
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
                  style={{ width: '40px', height: '22px', accentColor: 'var(--accent-violet)', cursor: 'pointer' }}
                />
             </div>
             
             <button 
               onClick={clearData}
               style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', textAlign: 'left' }}
             >
                <Trash2 size={16} />
                <span className="t-body" style={{ fontSize: '14px' }}>Clear Local Storage</span>
             </button>
          </div>
        </section>

        <button 
          onClick={handleSignOut}
          className="btn-primary" 
          style={{ background: 'rgba(255, 71, 87, 0.05)', color: '#ff4757', border: '1px solid rgba(255, 71, 87, 0.1)', height: '52px' }}
        >
          <LogOut size={18} /> Sign Out
        </button>

      </div>

      <TabBar />
    </div>
  );
}
