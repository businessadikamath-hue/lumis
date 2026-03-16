import { useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { useAuth } from '../context/AuthContext';
import { TabBar } from '../components/TabBar';
import { Calendar } from '../components/Calendar';
import { Sparkles, History, Layout } from 'lucide-react';

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

        {/* Welcome Graphic Card */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '0', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            marginBottom: '32px', 
            position: 'relative', 
            height: '200px',
            border: '1px solid var(--glass-border-hi)'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Welcome" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,20,40,0.9), transparent)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '4px 8px', borderRadius: '8px', background: 'var(--accent-violet)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Daily Flow</div>
            </div>
            <h2 className="t-heading" style={{ color: 'white', fontSize: '20px', marginBottom: '4px' }}>Ready to reflect?</h2>
            <p className="t-caption" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>Taking a moment for yourself is the first step to clarity.</p>
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
