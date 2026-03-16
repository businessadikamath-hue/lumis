import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const avgEnergy = entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.energy, 0) / entries.length).toFixed(1) : 0;
  const avgStress = entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.stress, 0) / entries.length).toFixed(1) : 0;

  const [aiReportType, setAiReportType] = useState<'weekly' | 'monthly' | null>(null);

  const handleGenerateAI = async (type: 'weekly' | 'monthly') => {
    setAiLoading(true);
    setAiError(null);
    setAiReportType(type);
    try {
      const sliceCount = type === 'weekly' ? 7 : 30;
      const result = await generateAIOverview(entries.slice(0, sliceCount), type);
      setAiResult(result);
    } catch (err: any) {
      setAiError(err.message || "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="screen" style={{ padding: '24px', paddingBottom: '110px' }}>
      <div className="ambient-bg" style={{ zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', marginTop: '20px' }}>
          <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronLeft /></button>
          <h1 className="t-title">Insights</h1>
        </header>

        {/* AI Overview Section */}
        <section style={{ marginBottom: '32px' }}>
          {entries.length < 5 ? (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--accent-violet-20)' }}>
              <Sparkles size={32} color="var(--accent-violet)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p className="t-heading" style={{ fontSize: '16px', marginBottom: '8px' }}>AI Reports</p>
              <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>You need at least 5 entries for AI reports.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(124, 107, 255, 0.1) 0%, rgba(94, 196, 255, 0.05) 100%)', border: '1px solid var(--accent-violet-20)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="t-heading" style={{ fontSize: '16px' }}>AI Reports</h3>
                  <p className="t-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>Periodic patterns & correlations</p>
                </div>
              </div>

              {!aiResult && !aiLoading && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-primary" onClick={() => handleGenerateAI('weekly')} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', height: '44px' }}>Weekly</button>
                  <button className="btn-primary" onClick={() => handleGenerateAI('monthly')} style={{ flex: 1, height: '44px' }}>Monthly</button>
                </div>
              )}

              {aiLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Loader2 className="spin" size={24} color="var(--accent-violet)" />
                  <p className="t-caption" style={{ marginTop: '12px' }}>Generating {aiReportType} report...</p>
                </div>
              )}

              {aiError && (
                <p className="t-caption" style={{ color: '#ff4757', marginTop: '12px' }}>{aiError}</p>
              )}

              {aiResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <p className="t-mono" style={{ fontSize: '10px', opacity: 0.5 }}>{aiReportType?.toUpperCase()} REPORT</p>
                    <button onClick={() => setAiResult(null)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-violet)', fontSize: '11px', fontWeight: 700 }}>New Report</button>
                  </div>
                  <p className="t-body" style={{ fontSize: '15px', color: 'white', marginBottom: '16px', lineHeight: '1.5' }}>{aiResult.summary}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {aiResult.correlations.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--accent-violet)' }}>•</span>
                        <p className="t-caption" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>{c}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', display: 'inline-block', padding: '4px 12px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="t-mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tone: {aiResult.emotionalTone}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </section>

        {/* Global Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <p className="t-caption" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Mood</p>
            <p className="t-heading" style={{ fontSize: '20px', color: getMoodColor(Number(avgMood)) }}>{avgMood}</p>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <p className="t-caption" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Energy</p>
            <p className="t-heading" style={{ fontSize: '20px', color: '#5ec4ff' }}>{avgEnergy}</p>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <p className="t-caption" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Stress</p>
            <p className="t-heading" style={{ fontSize: '20px', color: '#ff8c69' }}>{avgStress}</p>
          </div>
        </div>

        {/* Detailed Graph */}
        <div className="glass-card" style={{ padding: '20px', height: '340px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 className="t-heading">Trends</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '2px', background: 'var(--accent-violet)' }} />
                <span style={{ fontSize: '9px', opacity: 0.5 }}>Mood</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '2px', background: '#5ec4ff' }} />
                <span style={{ fontSize: '9px', opacity: 0.5 }}>Energy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '2px', background: '#ff8c69' }} />
                <span style={{ fontSize: '9px', opacity: 0.5 }}>Stress</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{ background: 'rgba(18,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="mood" stroke="var(--accent-violet)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="energy" stroke="#5ec4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="stress" stroke="#ff8c69" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <section>
          <h3 className="t-heading" style={{ marginBottom: '16px' }}>Context Distribution</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Array.from(new Set(entries.flatMap(e => e.tags))).slice(0, 10).map(tag => (
              <div key={tag} className="glass-card" style={{ padding: '8px 16px', fontSize: '13px', background: 'rgba(255,255,255,0.02)' }}>
                {tag}
              </div>
            ))}
          </div>
        </section>
      </div>

      <TabBar />
    </div>
  );
}
