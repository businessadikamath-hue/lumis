import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { pageVariants, staggerContainer, cardEntrance } from '../animations/variants';
import { ChevronLeft } from 'lucide-react';
import { getMoodColor } from '../utils/moodColor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TabBar } from '../components/TabBar';

export default function InsightsScreen() {
  const { entries } = useJournal();
  const navigate = useNavigate();

  const data = [...entries].reverse().map(e => ({
    date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    mood: e.mood,
    energy: e.energy,
    stress: e.stress
  }));

  const avgMood = entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.mood, 0) / entries.length).toFixed(1) : 0;

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
        <h1 className="t-title">Insights</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>Avg Mood</p>
          <p className="t-display" style={{ fontSize: '32px', color: getMoodColor(Number(avgMood)) }}>{avgMood}</p>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>Entries</p>
          <p className="t-display" style={{ fontSize: '32px' }}>{entries.length}</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', height: '300px', marginBottom: '32px' }}>
        <p className="t-heading" style={{ marginBottom: '16px' }}>Trends</p>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
            <YAxis domain={[1, 10]} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ background: 'rgba(18,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="mood" stroke="var(--accent-violet)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="stress" stroke="#ff8c69" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <section style={{ marginBottom: '100px' }}>
        <h3 className="t-heading" style={{ marginBottom: '16px' }}>Tags Distribution</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Array.from(new Set(entries.flatMap(e => e.tags))).map(tag => (
            <div key={tag} className="glass-card" style={{ padding: '8px 16px', fontSize: '13px' }}>
              {tag} <span style={{ color: 'var(--text-tertiary)', marginLeft: '4px' }}>
                {entries.filter(e => e.tags.includes(tag)).length}
              </span>
            </div>
          ))}
        </div>
      </section>

      <TabBar />
    </motion.div>
  );
}
