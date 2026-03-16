import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    title: "Your mind deserves a place to land.",
    sub: "A private daily journal built for students. No streaks, no pressure — just you.",
    icon: "🧘"
  },
  {
    title: "Three numbers. One moment. Every day.",
    sub: "Log your mood, energy, and stress in seconds to see patterns over time.",
    icon: "📊"
  },
  {
    title: "Only you can read this.",
    sub: "Your entries live on this device. Cloud backup is enabled by default so you never lose a memory.",
    icon: "🔒"
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      localStorage.setItem('lumis_onboarded', 'true');
      if (name) localStorage.setItem('lumis_name', name);
      navigate('/checkin');
    }
  };

  return (
    <div 
      className="screen"
      style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <div className="ambient-bg" style={{ zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'left' }}
          >
            <div style={{ fontSize: '72px', marginBottom: '32px' }}>{SLIDES[currentSlide].icon}</div>
            <h1 className="t-display" style={{ marginBottom: '16px', fontSize: '32px', lineHeight: '1.2' }}>{SLIDES[currentSlide].title}</h1>
            <p className="t-body" style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>{SLIDES[currentSlide].sub}</p>
            
            {currentSlide === 2 && (
              <div style={{ marginBottom: '32px' }}>
                <input 
                  type="text" className="glass-input" placeholder="What should we call you?"
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {SLIDES.map((_, i) => (
            <div 
              key={i}
              style={{ 
                height: '8px', 
                borderRadius: '4px', 
                background: currentSlide === i ? 'var(--accent-violet)' : 'rgba(255,255,255,0.15)',
                width: currentSlide === i ? '24px' : '8px',
                transition: 'all 0.4s var(--ease-out)'
              }}
            />
          ))}
        </div>

        <button 
          className="btn-primary" 
          onClick={handleNext}
          style={{ background: 'var(--accent-violet)', border: 'none', color: 'white', borderRadius: '100px', cursor: 'pointer' }}
        >
          {currentSlide === 2 ? 'Begin journaling →' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
