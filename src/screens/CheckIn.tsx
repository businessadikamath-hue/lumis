import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { useTheme } from '../context/ThemeContext';
import { pageVariants } from '../animations/variants';
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
    <motion.div 
      className="screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '40px' }}
    >
      <div className="ambient-bg" />
      
      {step < 6 && (
        <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '40px' }}>
          <motion.div 
            animate={{ width: `${(step / 5) * 100}%` }}
            style={{ height: '100%', background: 'var(--accent-violet)', borderRadius: '3px' }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="t-display" style={{ marginBottom: '32px' }}>How are you feeling right now?</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {EMOJIS.map(e => (
                  <button 
                    key={e} 
                    onClick={() => { setEmoji(e); handleNext(); }}
                    style={{ fontSize: '40px', background: emoji === e ? 'var(--accent-violet-20)' : 'transparent', border: '1px solid ' + (emoji === e ? 'var(--accent-violet)' : 'transparent'), borderRadius: '16px', padding: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="t-title" style={{ marginBottom: '32px' }}>The Basics</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <MoodSlider label="Overall Mood" value={mood} setValue={setMood} color={getMoodColor(mood)} />
                <MoodSlider label="Energy Level" value={energy} setValue={setEnergy} color="#5ec4ff" />
                <MoodSlider label="Stress Level" value={stress} setValue={setStress} color="#ff8c69" />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="t-title" style={{ marginBottom: '24px' }}>In your own words</h1>
              <textarea 
                className="glass-input" 
                placeholder="What's on your mind? No rules here."
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                style={{ height: '200px', resize: 'none' }}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="t-title" style={{ marginBottom: '24px' }}>Add context</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TAGS.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    style={{ 
                      padding: '10px 18px', borderRadius: '100px', 
                      background: selectedTags.includes(tag) ? 'var(--accent-violet-20)' : 'var(--glass-bg)',
                      border: '1px solid ' + (selectedTags.includes(tag) ? 'var(--accent-violet)' : 'var(--glass-border)'),
                      color: selectedTags.includes(tag) ? 'white' : 'var(--text-secondary)',
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
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
              <h1 className="t-display" style={{ marginBottom: '16px' }}>All set</h1>
              <p className="t-body" style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Your entry is ready to be saved.</p>
              <button className="btn-primary" onClick={handleSubmit}>Save entry</button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: '80px' }}>
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
            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', opacity: step === 1 ? 0 : 1, cursor: 'pointer' }}
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
    </motion.div>
  );
}
