import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournal } from '../context/JournalContext';

import { useTheme } from '../context/ThemeContext';
import { pageVariants, staggerContainer, cardEntrance } from '../animations/variants';
import { getMoodColor } from '../utils/moodColor';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TabBar } from '../components/TabBar';

export default function HomeScreen() {
  const { entries, todayEntry } = useJournal();
  const { moodColor } = useTheme();
  const navigate = useNavigate();

  const firstName = localStorage.getItem('lumis_name') || 'there';
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const chartData = [...entries].reverse().slice(0, 7);

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ padding: '24px', paddingBottom: '100px' }}
    >
      <div className="ambient-bg" />

      <header style={{ marginTop: '40px', marginBottom: '32px' }}>
        <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>Good morning, {firstName}</p>
        <h1 className="t-display" style={{ color: 'white' }}>{dateFormatted}</h1>
        
        {todayEntry ? (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '32px' }}>{todayEntry.emoji}</span>
            <span className="t-title" style={{ color: getMoodColor(todayEntry.mood) }}>{todayEntry.mood}/10</span>
          </div>
        ) : (
          <motion.button 
            onClick={() => navigate('/checkin')}
            className="glass-card"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ marginTop: '16px', width: '100%', padding: '20px', textAlign: 'left', borderLeft: '3px solid var(--accent-violet)', cursor: 'pointer' }}
          >
            <p className="t-heading">How are you feeling today? →</p>
          </motion.button>
        )}
      </header>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <p className="t-caption" style={{ marginBottom: '12px' }}>This week</p>
        <div style={{ height: '80px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={moodColor} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={moodColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke={moodColor} 
                strokeWidth={2} 
                fill="url(#moodGrad)" 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <motion.section 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <h3 className="t-heading">Recent</h3>
        {entries.slice(0, 5).map(entry => (
          <motion.div 
            key={entry.id} 
            variants={cardEntrance}
            onClick={() => navigate(`/entry/${entry.id}`)}
            className="glass-card" 
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '24px' }}>{entry.emoji}</span>
            <div style={{ flex: 1 }}>
              <p className="t-heading" style={{ fontSize: '14px' }}>{new Date(entry.date).toLocaleDateString()}</p>
              <p className="t-caption" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                {entry.freeText || 'No text entry'}
              </p>
            </div>
            <div style={{ padding: '4px 8px', borderRadius: '8px', background: getMoodColor(entry.mood) + '22', color: getMoodColor(entry.mood), fontWeight: '700' }}>
              {entry.mood}
            </div>
          </motion.div>
        ))}
      </motion.section>

      <TabBar />
    </motion.div>
  );
}
