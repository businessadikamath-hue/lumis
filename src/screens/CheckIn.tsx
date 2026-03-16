import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { useTheme } from '../context/ThemeContext';
import { getMoodColor } from '../utils/moodColor';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { MoodSlider } from '../components/MoodSlider';

const EMOJIS = ['😞', '😟', '😕', '😐', '🙂', '😊', '😄', '🤩', '😌', '😤'];
const TAGS = ["exam week", "bad sleep", "good sleep", "social anxiety", "social battery low", "social battery high", "grateful", "overwhelmed", "focused", "unmotivated", "family", "friendship", "relationship"];

export default function CheckInScreen() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [emoji, setEmoji] = useState('😐');
  const [freeText, setFreeText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addEntry } = useJournal();
  const { setMoodColor } = useTheme();
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => (s > 1 ? s - 1 : s));

  const handleSubmit = async () => {
    await addEntry({
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      mood,
      energy,
      stress,
      emoji,
      freeText,
      tags: selectedTags,
      promptResponses: [],
      personalStatement: []
    });
    setMoodColor(getMoodColor(mood));
    setStep(6);
    setTimeout(() => navigate('/home'), 1800);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div 
      className="screen"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="ambient-bg" style={{ zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step < 6 && (
          <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '40px' }}>
            <div 
              style={{ 
                height: '100%', 
                background: 'var(--accent-violet)', 
                borderRadius: '3px',
                width: `${(step / 5) * 100}%`,
                transition: 'width 0.4s var(--ease-out)'
              }}
            />
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="t-display" style={{ marginBottom: '32px', fontSize: '32px' }}>How are you feeling right now?</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  {EMOJIS.map(e => (
                    <button 
                      key={e} 
                      onClick={() => { setEmoji(e); handleNext(); }}
                      style={{ fontSize: '32px', background: emoji === e ? 'rgba(124, 107, 255, 0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (emoji === e ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)'), borderRadius: '16px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="t-title" style={{ marginBottom: '32px' }}>The Basics</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <MoodSlider label="Overall Mood" value={mood} setValue={setMood} color={getMoodColor(mood)} />
                  <MoodSlider label="Energy Level" value={energy} setValue={setEnergy} color="#5ec4ff" />
                  <MoodSlider label="Stress Level" value={stress} setValue={setStress} color="#ff8c69" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="t-title" style={{ marginBottom: '24px' }}>In your own words</h1>
                <textarea 
                  className="glass-input" 
                  placeholder="What's on your mind? No rules here."
                  value={freeText}
                  onChange={e => setFreeText(e.target.value)}
                  style={{ height: '200px', resize: 'none', background: 'rgba(255,255,255,0.08)' }}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="t-title" style={{ marginBottom: '24px' }}>Add context</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {TAGS.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => toggleTag(tag)}
                      style={{ 
                        padding: '10px 18px', borderRadius: '100px', 
                        background: selectedTags.includes(tag) ? 'rgba(124, 107, 255, 0.2)' : 'rgba(255,255,255,0.06)',
                        border: '1px solid ' + (selectedTags.includes(tag) ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)'),
                        color: selectedTags.includes(tag) ? 'white' : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', fontSize: '14px'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', paddingTop: '40px' }}
              >
                <h1 className="t-display" style={{ marginBottom: '16px', fontSize: '32px' }}>All set</h1>
                <p className="t-body" style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Your entry is ready to be saved.</p>
                <button className="btn-primary" onClick={handleSubmit}>Save entry</button>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div 
                key="step6" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', paddingTop: '80px' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4fd1a0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Check size={40} />
                </div>
                <h1 className="t-title">Done.</h1>
                <p className="t-body" style={{ color: 'var(--text-secondary)' }}>See you tomorrow.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < 5 && (
          <footer style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button 
              onClick={handleBack} 
              disabled={step === 1}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px', visibility: step === 1 ? 'hidden' : 'visible', cursor: 'pointer' }}
            >
              <ChevronLeft size={20} /> Back
            </button>
            <button 
              onClick={handleNext}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-violet)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              Continue <ChevronRight size={20} />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
