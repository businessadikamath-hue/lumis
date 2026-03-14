import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

export const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="glass-nav" style={{ 
      position: 'fixed', bottom: 0, left: 0, right: 0, 
      height: '80px', display: 'flex', alignItems: 'center', 
      justifyContent: 'space-around', paddingBottom: '20px', zIndex: 10 
    }}>
      {tabs.map(tab => (
        <button 
          key={tab.path}
          onClick={() => navigate(tab.path)} 
          style={{ 
            background: 'transparent', border: 'none', 
            color: location.pathname === tab.path ? 'var(--accent-violet)' : 'var(--text-tertiary)', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            cursor: 'pointer'
          }}
        >
          <tab.icon size={24} />
          <span className="t-caption">{tab.label}</span>
          {location.pathname === tab.path && (
            <motion.div layoutId="nav-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-violet)' }} />
          )}
        </button>
      ))}

      <button 
        onClick={() => navigate('/checkin')} 
        style={{ 
          position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
          width: '56px', height: '56px', borderRadius: '50%', 
          background: 'var(--accent-violet)', color: 'white', border: 'none', 
          boxShadow: '0 8px 16px var(--accent-violet-20)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <PenLine size={24} />
      </button>
    </nav>
  );
};
