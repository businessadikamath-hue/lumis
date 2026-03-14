import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { pageVariants, staggerContainer, cardEntrance } from '../animations/variants';
import { ChevronLeft, Flame } from 'lucide-react';
import { getMoodColor } from '../utils/moodColor';

export default function HistoryScreen() {
  const { entries } = useJournal();
  const navigate = useNavigate();

  // Streak calculation (simplified)
  const streak = 5; // Placeholder for real logic

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '24px' }}
    >
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
        <h1 className="t-title">History</h1>
      </header>

      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', borderLeft: '4px solid #ff8c69' }}>
        <div style={{ padding: '12px', background: 'rgba(255, 140, 105, 0.1)', borderRadius: '12px', color: '#ff8c69' }}>
          <Flame size={24} />
        </div>
        <div>
          <p className="t-title" style={{ fontSize: '24px' }}>{streak} Day Streak</p>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>You're on a roll!</p>
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="initial" animate="animate"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '100px' }}
      >
        {entries.map(entry => (
          <motion.div 
            key={entry.id} 
            variants={cardEntrance}
            onClick={() => navigate(`/entry/${entry.id}`)}
            className="glass-card" 
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getMoodColor(entry.mood) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              {entry.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p className="t-heading" style={{ fontSize: '14px' }}>{new Date(entry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
              <p className="t-caption" style={{ color: 'var(--text-tertiary)' }}>{entry.tags.slice(0, 2).join(' • ')}</p>
            </div>
            <p className="t-title" style={{ fontSize: '18px', color: getMoodColor(entry.mood) }}>{entry.mood}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
