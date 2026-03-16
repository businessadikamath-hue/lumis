import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { getMoodColor } from '../utils/moodColor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TabBar } from '../components/TabBar';
import { generateAIOverview } from '../utils/ai';

export default function InsightsScreen() {
  const { entries } = useJournal();
  const navigate = useNavigate();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ summary: string; correlations: string[]; emotionalTone: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const data = [...entries].reverse().map(e => ({
    date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    mood: e.mood,
    energy: e.energy,
    stress: e.stress
  }));

  const avgMood = entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.mood, 0) / entries.length).toFixed(1) : 0;

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await generateAIOverview(entries.slice(0, 10)); // Analyze last 10 entries
      setAiResult(result);
    } catch (err: any) {
      setAiError(err.message || "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div 
      className="screen"
      style={{ padding: '24px', paddingBottom: '100px' }}
    >
      <div className="ambient-bg" style={{ zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronLeft /></button>
          <h1 className="t-title">Insights</h1>
        </header>

        {/* AI Overview Section */}
        <section style={{ marginBottom: '32px' }}>
          {entries.length < 5 ? (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(124, 107, 255, 0.05)', border: '1px dashed var(--accent-violet-20)' }}>
              <Sparkles size={32} color="var(--accent-violet)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p className="t-heading" style={{ fontSize: '16px', marginBottom: '8px' }}>AI Overview</p>
              <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>You need at least 5 entries to unlock AI insights. Keep journaling!</p>
              <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: `${(entries.length / 5) * 100}%`, height: '100%', background: 'var(--accent-violet)', borderRadius: '2px' }} />
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(124, 107, 255, 0.1) 0%, rgba(94, 196, 255, 0.05) 100%)', border: '1px solid var(--accent-violet-20)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="t-heading" style={{ fontSize: '16px' }}>AI Overview</h3>
                  <p className="t-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>Analyzing your patterns...</p>
                </div>
              </div>

              {!aiResult && !aiLoading && (
                <button className="btn-primary" onClick={handleGenerateAI} style={{ height: '44px', fontSize: '14px' }}>
                  Generate Reflection
                </button>
              )}

              {aiLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Loader2 className="spin" size={24} color="var(--accent-violet)" style={{ margin: '0 auto' }} />
                  <p className="t-caption" style={{ marginTop: '12px' }}>Connecting with Claude...</p>
                </div>
              )}

              {aiError && (
                <p className="t-caption" style={{ color: '#ff4757', marginTop: '12px' }}>{aiError}</p>
              )}

              <AnimatePresence>
                {aiResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="t-body" style={{ fontSize: '15px', color: 'white', marginBottom: '16px', lineHeight: '1.6' }}>
                      {aiResult.summary}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiResult.correlations.map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--accent-violet)' }}>•</span>
                          <p className="t-caption" style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>{c}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '16px', display: 'inline-block', padding: '4px 12px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="t-mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tone: {aiResult.emotionalTone}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

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

        <section>
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
      </div>

      <TabBar />
    </div>
  );
}
