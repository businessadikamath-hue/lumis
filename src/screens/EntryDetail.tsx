import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { pageVariants } from '../animations/variants';
import { ChevronLeft, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { getMoodColor, getMoodLabel } from '../utils/moodColor';

export default function EntryDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { entries, deleteEntry } = useJournal();
  const navigate = useNavigate();

  const entry = entries.find(e => e.id === id);

  if (!entry) return null;

  const handleDelete = async () => {
    if (window.confirm('Delete this entry?')) {
      await deleteEntry(entry.id);
      navigate('/home');
    }
  };

  const dateStr = new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      style={{ padding: '24px' }}
    >
      <div className="ambient-bg" />
      
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
        <button onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: '#ff4757' }}><Trash2 size={20} /></button>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '80px' }}>{entry.emoji}</span>
        <h1 className="t-title" style={{ marginTop: '16px', color: getMoodColor(entry.mood) }}>{getMoodLabel(entry.mood)}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-tertiary)' }}>
            <Calendar size={16} />
            <span className="t-body" style={{ fontSize: '14px' }}>{dateStr}</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-tertiary)' }} />
            <Clock size={16} />
            <span className="t-body" style={{ fontSize: '14px' }}>{timeStr}</span>
          </div>
          
          <p className="t-body" style={{ whiteSpace: 'pre-wrap', color: 'white' }}>
            {entry.freeText || 'No text recorded for this entry.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatCard label="Mood" value={entry.mood} color={getMoodColor(entry.mood)} />
          <StatCard label="Energy" value={entry.energy} color="#5ec4ff" />
          <StatCard label="Stress" value={entry.stress} color="#ff8c69" />
        </div>

        {entry.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px 0' }}>
            {entry.tags.map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Tag size={12} />
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
      <p className="t-caption" style={{ color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
      <p className="t-title" style={{ color }}>{value}</p>
    </div>
  );
}
