import { useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { useAuth } from '../context/AuthContext';
import { TabBar } from '../components/TabBar';
import { Calendar } from '../components/Calendar';
import { Sparkles, History } from 'lucide-react';

export default function HomeScreen() {
  const { entries } = useJournal();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.first_name || localStorage.getItem('lumis_name') || 'there';
  const entryCount = entries.length;

  return (
    <div className="screen" style={{ padding: '24px', paddingBottom: '110px' }}>
      <div className="ambient-bg" style={{ zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', marginTop: '20px' }}>
          <div>
            <h1 className="t-title" style={{ fontSize: '28px', color: 'white' }}>Hello, {userName}</h1>
            <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>You have {entryCount} total entries</p>
          </div>
          <div 
            onClick={() => navigate('/settings')}
            style={{ width: '44px', height: '44px', borderRadius: '15px', background: 'var(--accent-violet-20)', overflow: 'hidden', border: '1px solid var(--glass-border-hi)', cursor: 'pointer' }}
          >
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'lumis'}`} alt="profile" style={{ width: '100%', height: '100%' }} />
          </div>
        </header>

        {/* Actionable Check-In Card */}
        <div 
          onClick={() => navigate('/checkin')}
          className="glass-card" 
          style={{ 
            padding: '24px', 
            borderRadius: '24px', 
            marginBottom: '32px', 
            background: 'linear-gradient(135deg, var(--accent-violet) 0%, #a29fff 100%)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 12px 24px var(--accent-violet-20)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h2 className="t-heading" style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>Log Daily Check-In</h2>
              <p className="t-caption" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>Track your mood, stress, and energy in 30 seconds.</p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color="white" />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ marginBottom: '32px' }}>
          <Calendar entries={entries} />
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button 
             onClick={() => navigate('/history')}
             className="glass-card" 
             style={{ padding: '20px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
          >
            <History size={20} color="var(--accent-violet)" style={{ marginBottom: '12px' }} />
            <p className="t-heading" style={{ fontSize: '14px' }}>History</p>
            <p className="t-caption" style={{ fontSize: '11px', opacity: 0.5 }}>Your journey</p>
          </button>
          
          <button 
             onClick={() => navigate('/insights')}
             className="glass-card" 
             style={{ padding: '20px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
          >
            <Sparkles size={20} color="var(--accent-violet)" style={{ marginBottom: '12px' }} />
            <p className="t-heading" style={{ fontSize: '14px' }}>Insights</p>
            <p className="t-caption" style={{ fontSize: '11px', opacity: 0.5 }}>AI patterns</p>
          </button>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
