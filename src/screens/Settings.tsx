import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../animations/variants';
import { ChevronLeft, LogOut, Bell, Cloud, Trash2 } from 'lucide-react';
import { TabBar } from '../components/TabBar';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '24px' }}
    >
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
        <h1 className="t-title">Settings</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '100px' }}>
        <section>
          <p className="t-caption" style={{ marginBottom: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Account</p>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-violet-20)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)' }}>
                <Cloud size={20} />
              </div>
              <div>
                <p className="t-heading" style={{ fontSize: '14px' }}>{user?.email}</p>
                <p className="t-caption" style={{ color: 'var(--text-tertiary)' }}>Cloud sync active</p>
              </div>
            </div>
            <button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer' }}><LogOut size={20}/></button>
          </div>
        </section>

        <section>
          <p className="t-caption" style={{ marginBottom: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Preferences</p>
          <div className="glass-card" style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={20} color="var(--text-secondary)" />
                <span className="t-body" style={{ fontSize: '14px' }}>Daily Reminder</span>
              </div>
              <input type="checkbox" style={{ width: '40px', height: '20px' }} />
            </div>
          </div>
        </section>

        <section style={{ marginTop: '20px' }}>
          <button style={{ width: '100%', background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.2)', color: '#ff4757', padding: '14px', borderRadius: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Trash2 size={18} /> Delete all data
          </button>
        </section>
      </div>

      <TabBar />
    </motion.div>
  );
}
